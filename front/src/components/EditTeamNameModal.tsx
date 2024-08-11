import React from "react";

import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface EditTeamNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: { id: number; name: string };
  onUpdate: () => void;
}

const EditTeamNameModal: React.FC<EditTeamNameModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdate,
}) => {
  const [newTeamName, setNewTeamName] = React.useState<string>(
    team?.name || ""
  );

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/teams/${team.id}`, {
        name: newTeamName,
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Hubo un problema al actualizar el equipo:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Editar Nombre del Equipo</h2>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Nombre del Equipo"
            className="input input-bordered w-full mb-4"
          />
          <div className="modal-action">
            <button onClick={handleSave} className="btn btn-primary">
              Guardar
            </button>
            <button onClick={onClose} className="btn">
              Cancelar
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

export default EditTeamNameModal;
