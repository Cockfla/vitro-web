"use client";

import { useEffect, useState } from "react";

// La página se genera en el build; el año del servidor puede quedar viejo. Tras
// hidratar se corrige con el año del navegador.
export default function CurrentYear({ initial }) {
  const [year, setYear] = useState(initial);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return year;
}
