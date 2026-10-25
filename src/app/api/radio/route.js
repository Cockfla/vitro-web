import { Buffer } from "node:buffer";
import { connect } from "node:tls";

// El stream es SHOUTcast v1 y responde "ICY 200 OK" (no es HTTP válido). Safari
// iOS no reproduce eso directo en un <audio>, y fetch() de Node tampoco lo
// parsea. Este endpoint abre el socket a mano y reexpone el audio como una
// respuesta HTTP normal, same-origin.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel corta la función al llegar a este límite; el cliente reconecta solo.
export const maxDuration = 300;

const STREAM_HOST = "servers58.com";
const STREAM_PATH = "/proxy/sc_elvitrola?mp=/;";
const CONNECT_TIMEOUT_MS = 15000;
const MAX_HEADER_BYTES = 16 * 1024;

const UPSTREAM_REQUEST = [
  `GET ${STREAM_PATH} HTTP/1.0`,
  `Host: ${STREAM_HOST}`,
  "User-Agent: VitrolaWeb/1.0",
  "Accept: audio/mpeg, audio/*;q=0.9, */*;q=0.8",
  "Icy-MetaData: 0",
  "Connection: close",
  "",
  "",
].join("\r\n");

// Conecta, envía la petición y espera a que termine la cabecera ICY/HTTP.
// Devuelve el socket y los bytes de audio que llegaron pegados a la cabecera.
function openUpstream() {
  return new Promise((resolve, reject) => {
    const socket = connect({ host: STREAM_HOST, port: 443, servername: STREAM_HOST });
    let head = Buffer.alloc(0);

    const fail = (error) => {
      socket.destroy();
      reject(error);
    };
    const onTimeout = () => fail(new Error("Timeout conectando con la radio"));

    socket.setTimeout(CONNECT_TIMEOUT_MS);
    socket.once("timeout", onTimeout);
    socket.once("error", fail);
    socket.once("secureConnect", () => socket.write(UPSTREAM_REQUEST));

    const onData = (chunk) => {
      head = Buffer.concat([head, chunk]);
      const end = head.indexOf("\r\n\r\n");
      if (end === -1) {
        if (head.length > MAX_HEADER_BYTES) fail(new Error("Cabecera demasiado larga"));
        return;
      }

      socket.off("data", onData);
      socket.off("timeout", onTimeout);
      socket.off("error", fail);
      socket.pause();

      const statusLine = head.subarray(0, end).toString("latin1").split("\r\n")[0];
      if (!/^(ICY|HTTP\/1\.[01]) 200/.test(statusLine)) {
        fail(new Error(`Respuesta inesperada de la radio: ${statusLine}`));
        return;
      }
      resolve({ socket, initial: head.subarray(end + 4) });
    };
    socket.on("data", onData);
  });
}

export async function GET(request) {
  let upstream;
  try {
    upstream = await openUpstream();
  } catch (error) {
    console.error("[api/radio]", error.message);
    return new Response("Señal no disponible", { status: 502 });
  }

  const { socket, initial } = upstream;

  const stream = new ReadableStream({
    start(controller) {
      const close = () => {
        socket.destroy();
        try {
          controller.close();
        } catch {}
      };

      if (initial.length > 0) controller.enqueue(initial);

      socket.on("data", (chunk) => {
        controller.enqueue(chunk);
        if (controller.desiredSize <= 0) socket.pause();
      });
      socket.on("end", close);
      socket.on("close", close);
      socket.on("error", (error) => {
        socket.destroy();
        try {
          controller.error(error);
        } catch {}
      });
      // Si deja de llegar audio, se corta y el cliente reconecta.
      socket.setTimeout(CONNECT_TIMEOUT_MS, close);

      request.signal.addEventListener("abort", () => socket.destroy());
    },
    pull() {
      socket.resume();
    },
    cancel() {
      socket.destroy();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Accept-Ranges": "none",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
