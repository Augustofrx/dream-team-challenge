import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

import {
  Player,
  TeamPlayer,
  TeamPositions,
  Position,
  PlayerRole,
  Team,
} from "../schemas";

import {
  positionMapper,
  predefinedPositions,
  getTeamName,
  isTeamFull,
  isPlayerInAnyTeam,
  isPositionOccupied,
  validateRoleCount,
  roleMapper,
  createTeam,
} from "../utils";
import Carousel from "./Carousel";
import { useTeams } from "../hooks/useTeams";
import axios from "axios";
import EditTeamNameModal from "./EditTeamNameModal";

const COLLISION_RADIUS = 10;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const FootballField = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<{
    [key: string]: Position;
  } | null>(null);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [creatingTeam, setCreatingTeam] = useState<boolean>(false);
  // const [isValid, setIsValid] = useState<boolean>(false);
  const [token, setToken] = useState<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      carouselRef.current &&
      !carouselRef.current.contains(event.target as Node)
    ) {
      setSelectedPlayer(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { data: teams, error, isLoading, refetch } = useTeams();

  const openEditModal = (team: { id: number; name: string }) => {
    setTeamToEdit(team);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTeamToEdit(null);
  };

  const updateTeamList = async () => {
    refetch();
  };

  const deleteTeam = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      if (result.isConfirmed) {
        await axios.delete(`${API_BASE_URL}/teams/${id}`);
        Swal.fire("Eliminado!", "El equipo ha sido eliminado.", "success");
        setSelectedTeam(null);
        refetch();
        fetchPlayers();
      }
    } catch (error) {
      console.error("Hubo un problema al eliminar el equipo:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el equipo.", "error");
    }
  };

  const addPlayer = async (playerData: {
    player_name: string;
    player_image: string;
    player_type: string;
    teamSide: string;
    teamId: number;
    userId: string;
  }) => {
    try {
      await axios.post(`${API_BASE_URL}/players`, playerData);

      fetchPlayers();
    } catch (error) {
      console.error("Error al agregar el jugador:", error);
      Swal.fire({
        text: "Hubo un problema al agregar el jugador.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };

  const deletePlayer = (playerId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE_URL}/players/${playerId}`);
        Swal.fire("Eliminado!", "El jugador ha sido eliminado.", "success");
        fetchPlayers();
      }
    });
  };

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/players`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayers(response.data);
      }
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
    }
  };

  useEffect(() => {
    const tokenData = localStorage.getItem("accessToken");
    if (tokenData) {
      try {
        const decodedToken = jwtDecode(tokenData);
        setToken(decodedToken);
        fetchPlayers();
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (token === undefined) {
      router.push("/");
    }
  }, [token]);

  const closeSession = () => {
    localStorage.removeItem("accessToken");
    setToken(undefined);
  };

  useEffect(() => {
    if (selectedTeam) {
      const positions = predefinedPositions[selectedTeam];
      const usedRoles = players
        .filter((player) => player.teamSide === selectedTeam)
        .map((player) => player.player_type);

      const availableRoles = Object.keys(positions).filter((role) => {
        let roleAsPlayerType:
          | "Defenders"
          | "Goalkeepers"
          | "Midfielders"
          | "Forwards";

        if (role.startsWith("Defender")) {
          roleAsPlayerType = "Defenders";
        } else if (role.startsWith("Goalkeeper")) {
          roleAsPlayerType = "Goalkeepers";
        } else if (role.startsWith("Midfielder")) {
          roleAsPlayerType = "Midfielders";
        } else if (role.startsWith("Forward")) {
          roleAsPlayerType = "Forwards";
        } else {
          return false;
        }

        if (role.startsWith("Defender")) {
          const defenderCount = usedRoles.filter(
            (r) => r === "Defenders"
          ).length;
          return defenderCount < 2;
        }

        return !usedRoles.includes(roleAsPlayerType);
      });

      const available = availableRoles.reduce((acc, role) => {
        acc[role as PlayerRole] = positions[role as PlayerRole];
        return acc;
      }, {} as { [key in PlayerRole]?: Position });

      setAvailablePositions(available);
    } else {
      setAvailablePositions(null);
    }
  }, [selectedTeam, players]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Swal.fire({
        text: "El nombre del equipo no puede estar vacío.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      setCreatingTeam(true);
      await createTeam(token, newTeamName, refetch);
      Swal.fire({
        text: "Equipo creado con éxito.",
        icon: "success",
      });
      setNewTeamName("");
    } catch (error) {
      Swal.fire({
        text: `${error}`,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } finally {
      setCreatingTeam(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const validateAndAddPlayer = async (position: Position, role: PlayerRole) => {
    if (!selectedTeam) {
      return false;
    }

    if (isTeamFull(players, "left") && isTeamFull(players, "right")) {
      Swal.fire({
        text: `Ambos equipos ya están formados.`,
        icon: "info",
        confirmButtonText: "Entendido",
      });
      return false;
    }

    if (isTeamFull(players, selectedTeam)) {
      Swal.fire({
        text: `El equipo ${getTeamName(selectedTeam)} ya está completo.`,
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return false;
    }
    if (validateRoleCount(players, selectedTeam, role)) {
      Swal.fire({
        text: `El equipo ${getTeamName(selectedTeam)} ya tiene ${
          roleMapper[role]
        }.`,
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return false;
    }

    if (isPlayerInAnyTeam(players, selectedPlayer?.player_name)) {
      Swal.fire({
        text: `El jugador ya se encuentra formando parte de un equipo.`,
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return false;
    }

    if (isPositionOccupied(players, position, selectedTeam)) {
      Swal.fire({
        text: `La posición seleccionada ya está ocupada por otro jugador.`,
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return false;
    }

    if (
      !isPositionValidForRole(
        { x: position.x, y: position.y },
        role,
        selectedTeam
      )
    ) {
      Swal.fire({
        text: `La posición no es válida para el rol seleccionado.`,
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return false;
    }

    if (selectedPlayer && teams && token) {
      const selectedTeamData = teams.find(
        (team) => team.teamSide === selectedTeam
      );
      const teamId = selectedTeamData ? selectedTeamData.id : -1;

      if (teamId !== -1) {
        const playerData = {
          player_name: selectedPlayer.player_name,
          player_image: selectedPlayer.player_image,
          player_type: selectedPlayer.player_type,
          position: position,
          teamSide: selectedTeam,
          teamId: teamId,
          userId: token.id,
        };

        await addPlayer(playerData);
        return true;
      } else {
        console.error("Equipo no encontrado");
        return false;
      }
    }
  };

  const handlePositionClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTeam) {
      Swal.fire({
        text: `No se ha seleccionado ningún equipo.`,
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return false;
    }
    if (selectedTeam && selectedPlayer) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      let role: PlayerRole | null = null;

      if (selectedPlayer.player_type === "Defenders") {
        const teamPlayers = players.filter(
          (player) => player.teamSide === selectedTeam
        );
        const existingDefenders = teamPlayers.filter(
          (player) =>
            player.player_type && player.player_type.startsWith("Defender")
        );

        if (existingDefenders.length === 0) {
          role = "Defender1";
        } else if (existingDefenders.length === 1) {
          role = "Defender2";
        } else {
          Swal.fire({
            text: `El equipo ${
              selectedTeam === "left"
                ? teams && teams[0]?.name
                : teams && teams[1]?.name
            } ya tiene 2 defensores.`,
            icon: "warning",
            confirmButtonText: "Entendido",
          });

          return;
        }
      } else {
        role = selectedPlayer.player_type.replace(/s$/, "") as
          | "Goalkeeper"
          | "Midfielder"
          | "Forward";
      }

      if (role) {
        const positionValid = await validateAndAddPlayer({ x, y }, role);
        console.log(positionValid);
        if (positionValid) {
          setSelectedPlayer(null);
        }
      }
    }
  };

  const isPositionValidForRole = (
    position: Position,
    role: PlayerRole,
    team: Team
  ) => {
    const positions = predefinedPositions[team];

    if (role.startsWith("Defender")) {
      const validPositions = Object.keys(positions) as Array<
        keyof TeamPositions
      >;
      const defenderPositions = validPositions
        .filter((key) => key.startsWith("Defender"))
        .map((key) => positions[key]);

      const isValidPosition = defenderPositions.some((validPosition) => {
        const distance = Math.sqrt(
          Math.pow(position.x - validPosition.x, 2) +
            Math.pow(position.y - validPosition.y, 2)
        );
        return distance < COLLISION_RADIUS;
      });

      return (
        isValidPosition &&
        (team === "left" ? position.x <= 50 : position.x >= 50)
      );
    }

    const validPosition = positions[role];
    if (!validPosition) return false;

    const distance = Math.sqrt(
      Math.pow(position.x - validPosition.x, 2) +
        Math.pow(position.y - validPosition.y, 2)
    );

    return (
      (team === "left" ? position.x <= 50 : position.x >= 50) &&
      distance < COLLISION_RADIUS
    );
  };

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <div className="w-full flex justify-end">
        <button className="btn btn-sm btn-error mx-2" onClick={closeSession}>
          Cerrar sesión
        </button>
      </div>
      <div className=" max-h-[150px] rounded-md">
        <h2 className="text-white text-anton">Crear equipos</h2>
        <input
          disabled={teams && teams?.length === 2}
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Nombre del Equipo"
          className="px-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleCreateTeam}
          disabled={creatingTeam || (teams && teams?.length === 2)}
          className={`px-4 py-2 mx-2 my-2 ${
            creatingTeam
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-500 disabled:text-white btn btn-xs "
          } text-white rounded-md`}
        >
          {creatingTeam ? "Creando..." : "Crear Equipo"}
        </button>
      </div>
      <section className="flex flex-col items-center gap-2 max-w-[1000px]">
        <div className="w-full p-0 m-0 flex justify-center items-center gap-2 min-h-[70px]">
          {teams &&
            teams.map((team) => (
              <div key={team?.id} className="w-[50%] flex justify-center pr-4 ">
                {team.name && (
                  <div className="px-4 py-2 my-2 min-w-full flex flex-col gap-2  text-anton  bg-gray-900 text-white border border-white rounded-md">
                    <span className="text-center font-semibold font-anton text-xl">
                      {team.name}
                    </span>
                    <div className="flex flex-col md:flex-row justify-around gap-2">
                      <button
                        onClick={() =>
                          team.teamSide === "left"
                            ? setSelectedTeam("left")
                            : setSelectedTeam("right")
                        }
                        className="btn btn-xs bg-green-600 hover:bg-green-500 text-white border-none"
                      >
                        Seleccionar equipo
                      </button>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="btn btn-xs bg-red-600 hover:bg-red-500 text-white border-none"
                      >
                        Eliminar equipo
                      </button>
                      <button
                        onClick={() => openEditModal(team)}
                        className="btn btn-xs bg-blue-600 hover:bg-blue-500 text-white border-none"
                      >
                        Editar equipo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        <div
          className="relative w-full h-[200px]  md:w-[650px] md:h-[450px] lg:w-[850px] lg:h-[500px] bg-cover bg-center border-2 border-gray-500 "
          style={{
            backgroundImage: "url('/cancha.jpg')",
            objectFit: "cover",
          }}
        >
          <div className="relative w-full h-full" onClick={handlePositionClick}>
            {players
              .filter((player) => player.teamSide === "left")
              .map((player) => (
                <div
                  key={player.player_id}
                  className="absolute h-8  w-8  rounded-full flex flex-col justify-center items-center"
                  style={{
                    right: `${100 - (player.position?.x ?? 0)}%`,
                    top: `${player.position?.y}%`,
                  }}
                >
                  <button
                    onClick={() => deletePlayer(player.player_id)}
                    className="text-sm absolute bottom-11 left-5 h-4 w-4 flex justify-center items-center rounded-full pb-1 bg-red-600 text-white"
                  >
                    x
                  </button>
                  <img
                    src={player.player_image}
                    alt="Player"
                    className="rounded-full max-h-[120px]"
                  />
                  <span className="text-sm md:text-md  font-anton font-bold text-center text-blue-900">
                    {player.player_name}
                  </span>
                </div>
              ))}
            {players
              .filter((player) => player.teamSide === "right")
              .map((player) => (
                <div
                  key={player.player_id}
                  className="absolute h-8 w-8  rounded-full flex flex-col justify-center items-center"
                  style={{
                    right: `${100 - (player.position?.x ?? 0)}%`,
                    top: `${player.position?.y}%`,
                  }}
                >
                  {" "}
                  <button
                    onClick={() => deletePlayer(player.player_id)}
                    className="text-sm absolute bottom-11 left-5 h-4 w-4 flex justify-center items-center rounded-full pb-1 bg-red-600 text-white"
                  >
                    x
                  </button>
                  <img
                    src={player.player_image}
                    alt="Player"
                    className="rounded-full max-h-[120px]"
                  />
                  <span className="text-xs md:text-md font-anton font-bold text-center text-red-900">
                    {player.player_name}
                  </span>{" "}
                </div>
              ))}
            {availablePositions &&
              Object.entries(availablePositions).map(([role, { x, y }]) => (
                <div
                  key={role}
                  className="absolute bg-yellow-500 w-10 h-10 rounded-full opacity-50"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
          </div>
        </div>

        <div className="w-full h-full flex flex-col mt-2">
          <h2 className=" text-lg md:text-2xl font-bold text-white text-center">
            Selecciona y agrega jugadores
          </h2>
          <div ref={carouselRef}>
            <Carousel
              selectedPlayer={selectedPlayer}
              handlePlayerClick={handlePlayerClick}
              positionMapper={positionMapper}
            />
          </div>
        </div>
        {teamToEdit && (
          <EditTeamNameModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            team={teamToEdit}
            onUpdate={updateTeamList}
          />
        )}
      </section>
    </div>
  );
};

export default FootballField;
