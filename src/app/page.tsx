"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SetaImage = "/assets/SETA.png";
const BackgroundImage = "/assets/fundo.png";
const logo = "/assets/logo.png";
const logo2 = "/assets/logo-centro.png";

const prizes = [
  "TOTEM A3",
  "TOTEM A6",
  "TOTEM A9",
  "TOTEM A12",
  "TOTEM A15",
  "TOTEM A13",
  "TABLET 10,5''",
  "FAN LED HOLOGRÁFICO",
  "PALESTRA SILENCIOSA ",
  "TOTEM A10",
];

const colors = ["#25abbe", "#ffffff"];

// --- COMPONENTE PRINCIPAL ---
export default function Roleta() {
  const [stage, setStage] = useState<"home" | "game" | "result">("home");
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState("");

  const spinWheel = () => {
    setSelectedPrize("");
    if (spinning) return;

    const extraSpin = Math.floor(Math.random() * 360);
    const totalRotation = 1440 + extraSpin;
    const finalAngle = angle + totalRotation;
    const adjustedAngle = (finalAngle + 90) % 360;
    const prizeIndex = Math.floor(
      ((360 - adjustedAngle) % 360) / (360 / prizes.length)
    );

    setAngle(finalAngle);
    setSpinning(true);

    setTimeout(() => {
      setSelectedPrize(prizes[prizeIndex]);
      setSpinning(false);
      setStage("result");
    }, 5000);
  };

  const resetGame = () => {
    setSpinning(false);
    setSelectedPrize("");
    setStage("home");
  };

  // NOVO: useEffect para disparar os confetes na tela de resultado
  useEffect(() => {
    if (stage === "result") {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        zIndex: 9999, // Garante que fique por cima de tudo
      });
    }
  }, [stage]);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center text-black relative overflow-hidden bg-sky-700"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <style jsx global>{`
        body,
        html {
          overflow: hidden;
        }
      `}</style>

      {/* --- TELA INICIAL --- */}
      {stage === "home" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img src={logo} alt="logo-principal" width={700}  />
          <motion.button
            className="mt-10 px-14 py-6 font-bold text-4xl bg-sky-500 text-white rounded-full shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            onClick={() => setStage("game")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar
          </motion.button>
        </motion.div>
      )}

      {/* --- TELA DO JOGO --- */}
      {stage === "game" && (
        // ALTERADO: Adicionada animação de entrada para a roleta
        <motion.div
          className="relative flex items-center justify-center pt-[5vh]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ponteiro */}
          <div className="absolute top-[9vw] left-1/2 -translate-x-1/2 z-20 w-[10vw]">
            <img src={SetaImage} alt="ponteiro" className="w-full" />
          </div>

          {/* Roleta */}
          <div
            className="relative rounded-full border-8 border-white transition-transform duration-[5s] ease-out"
            style={{
              width: "80vw",
              height: "80vw",
              maxWidth: "80vh",
              maxHeight: "80vh",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 600"
              onClick={!spinning ? spinWheel : undefined}
              className="cursor-pointer"
            >
              <g transform={`translate(300, 300)`}>
                {prizes.map((prize, i) => {
                  const radius = 300;
                  const sliceAngle = (2 * Math.PI) / prizes.length;
                  const startAngle = i * sliceAngle;
                  const endAngle = startAngle + sliceAngle;
                  const x1 = radius * Math.cos(startAngle);
                  const y1 = radius * Math.sin(startAngle);
                  const x2 = radius * Math.cos(endAngle);
                  const y2 = radius * Math.sin(endAngle);
                  const largeArc = sliceAngle > Math.PI ? 1 : 0;
                  const path = `M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
                  const textAngle = (startAngle + endAngle) / 2;
                  const textX = (radius / 1.8) * Math.cos(textAngle);
                  const textY = (radius / 1.8) * Math.sin(textAngle);
                  const rotate = (textAngle * 180) / Math.PI;

                  return (
                    <g key={i}>
                      <path d={path} fill={colors[i % 2]} />
                      <text
                        x={textX}
                        y={textY}
                        fill="black"
                        fontSize="20"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        transform={`rotate(${rotate}, ${textX}, ${textY})`}
                      >
                        {prize}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            {/* Logo no centro */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div
                className="w-[10vw] h-[10vw] max-w-[10vh] max-h-[10vh] bg-cover bg-center bg-[#25abbe] rounded-full"
                style={{ backgroundImage: `url(${logo2})` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* --- TELA DE RESULTADO --- */}
      {stage === "result" && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6 rounded-2xl bg-zinc-700/70 p-8 sm:p-16 shadow-2xl w-[1200px] max-w-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold text-sky-400 text-center">
              {selectedPrize!}
            </h1>
            <p className="text-4xl sm:text-5xl mt-2 text-white">Parabéns!</p>
            <motion.button
              onClick={resetGame}
              className="mt-4 px-12 py-5 font-bold bg-sky-500 text-white rounded-lg shadow-lg text-3xl sm:text-4xl"
              whileHover={{ scale: 1.05 }}
            >
              Voltar ao inicio
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
