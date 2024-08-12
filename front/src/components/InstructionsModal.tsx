import React from "react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">
            Instrucciones para Crear Equipos
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Solo se pueden crear{" "}
              <strong className="text-green-700">hasta dos equipos.</strong>{" "}
            </li>
            <li>
              Una vez creados los equipos, deberás{" "}
              <strong className="text-green-700">seleccionar un equipo</strong>,{" "}
              <strong className="text-green-700">buscar</strong> entre todos los{" "}
              <strong className="text-green-700">jugadores</strong>, y{" "}
              <strong className="text-green-700">agregarlos</strong> a un{" "}
              <strong className="text-green-700">equipo</strong>.
            </li>
            <li>
              Ten en cuenta que los jugadores{" "}
              <strong className="text-green-700">
                solo podrán ser agregados
              </strong>{" "}
              en el <strong className="text-green-700">área</strong> que les
              corresponde{" "}
              <strong className="text-green-700">según su rol</strong>.
            </li>
            <li>
              Para <strong className="text-green-700">agregar</strong>{" "}
              jugadores, solo basta con{" "}
              <strong className="text-green-700">seleccionarlo</strong> y{" "}
              <strong className="text-green-700">hacer clic</strong> en la{" "}
              <strong className="text-green-700">posición</strong> que le
              correspondería dentro de la cancha.
            </li>
            <li>
              Si agregaste un jugador por equivocación,{" "}
              <strong className="text-green-700">puedes eliminarlo</strong> y{" "}
              <strong className="text-green-700">
                agregar nuevamente otro
              </strong>
              .
            </li>
          </ul>
          <p className="mt-4 font-semibold font-anton text-lg">
            Disfruta creando tu Dream Team.
          </p>
          <div className="modal-action">
            <button onClick={onClose} className="btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default InstructionsModal;
