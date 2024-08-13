import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Player } from "../schemas";
import axios from "axios";
import Loader from "./Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Team {
  team_key: string;
  team_name: string;
  team_country: string;
  team_founded: string;
  team_badge: string;
  venue: {
    venue_name: string;
    venue_address: string;
    venue_city: string;
    venue_capacity: string;
    venue_surface: string;
  };
  players: Player[];
}

interface League {
  country_id: string;
  country_name: string;
  league_id: string;
  league_name: string;
  league_season: string;
  league_logo: string;
  country_logo: string;
}

interface Country {
  country_id: string;
  country_name: string;
  country_logo: string;
}

interface CarouselProps {
  selectedPlayer: Player | null;

  handlePlayerClick: (player: Player) => void;
  positionMapper: Record<string, string>;
}

const Carousel: React.FC<CarouselProps> = ({
  selectedPlayer,

  handlePlayerClick,
  positionMapper,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const backArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M20 9v6h-8v4.84L4.16 12L12 4.16V9z"></path>
    </svg>
  );

  const handleReturnToTeams = () => {
    setSelectedTeam(null);
  };

  const handleReturnToLeagues = () => {
    setSelectedLeague(null);
  };

  const handleReturnToCountries = () => {
    setSelectedCountry(null);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/teams/countries`);
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchLeagues = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${API_BASE_URL}/teams/leagues-from-country?countryId=${selectedCountry}`
          );
          const data = await response.json();
          setLeagues(data);
        } catch (error) {
          console.error("Error fetching leagues:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLeagues();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedLeague) {
      const fetchTeams = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${API_BASE_URL}/teams/teams-from-league?leagueId=${selectedLeague}`
          );
          const data = await response.json();
          setTeams(data);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTeams();
    }
  }, [selectedLeague]);

  const filteredTeams = teams?.filter((team) => team.team_key === selectedTeam);
  const filteredPlayers = filteredTeams.flatMap((team) => team.players);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {!selectedCountry && (
        <Swiper
          className="w-[360px] md:w-[740px] lg:max-w-[840px]"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          breakpoints={{
            320: {
              slidesPerView: 3,
            },

            1280: {
              slidesPerView: 4,
            },
          }}
          navigation
          scrollbar={{ draggable: true }}
        >
          {countries?.map((country) => (
            <SwiperSlide
              className="flex justify-center items-center"
              key={country.country_id}
            >
              <div
                className="md:w-44 md:h-44 w-28 h-28 rounded-md cursor-pointer border-4 my-4 border-gray-50 bg-white flex flex-col items-center justify-around"
                onClick={() => setSelectedCountry(country.country_id)}
              >
                <img
                  src={country.country_logo}
                  alt={country.country_name}
                  className="max-h-[50px] md:min-h-[90px]  md:w-full object-contain"
                />
                <span className="text-center mt-2 font-semibold text-xs md:text-md font-anton text-black">
                  {country.country_name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {selectedCountry && !selectedLeague && (
        <section>
          {leagues.length > 0 && (
            <button
              onClick={handleReturnToCountries}
              className="btn btn-xs md:btn-sm mt-2  md:ml-14 md:mt-0  bg-transparent border-white hover:bg-gray-500 text-white"
            >
              {backArrow}
              Regresar a paises
            </button>
          )}
          <Swiper
            className="w-[360px] md:w-[740px] lg:max-w-[840px]"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            breakpoints={{
              320: {
                slidesPerView: 3,
              },

              1280: {
                slidesPerView: 4,
              },
            }}
            navigation
            scrollbar={{ draggable: true }}
          >
            {leagues?.length > 0 &&
              leagues?.map((league) => (
                <SwiperSlide key={league.league_id}>
                  <div
                    className="md:w-44 md:h-44 w-28 h-28 rounded-md cursor-pointer border-4 my-4 border-gray-50 bg-white flex flex-col items-center justify-around"
                    onClick={() => setSelectedLeague(league.league_id)}
                  >
                    <img
                      src={league.league_logo}
                      alt={league.league_name}
                      className="max-h-[50px] md:min-h-[90px]  md:w-full object-contain"
                    />
                    <span className="text-center mt-2 font-semibold  font-anton text-xs md:text-md text-black">
                      {league.league_name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </section>
      )}

      {selectedLeague && !selectedTeam && (
        <section>
          {teams?.length > 0 && (
            <button
              onClick={handleReturnToLeagues}
              className="btn btn-xs md:btn-sm mt-2  md:ml-14  md:mt-0  bg-transparent border-white hover:bg-gray-500 text-white "
            >
              {" "}
              {backArrow}
              Regresar a ligas
            </button>
          )}
          <Swiper
            className="w-[360px] md:w-[740px] lg:max-w-[840px]"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            breakpoints={{
              320: {
                slidesPerView: 3,
              },

              1280: {
                slidesPerView: 4,
              },
            }}
            navigation
            scrollbar={{ draggable: true }}
          >
            {teams?.map((team) => (
              <SwiperSlide key={team.team_key}>
                <div
                  className="md:w-44 md:h-44 w-28 h-28  rounded-md cursor-pointer border-4 my-4 border-gray-50 bg-white flex flex-col items-center justify-around"
                  onClick={() => setSelectedTeam(team.team_key)}
                >
                  <img
                    src={team.team_badge}
                    alt={team.team_name}
                    className="max-h-[50px] md:min-h-[90px]  md:w-full object-contain"
                  />
                  <span className="text-center mt-2 font-semibold text-xs md:text-md font-anton text-black">
                    {team.team_name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {selectedTeam && (
        <section>
          {filteredPlayers.length > 0 && (
            <button
              onClick={handleReturnToTeams}
              className="btn btn-xs md:btn-sm mt-2  md:ml-14 md:ml-0 md:mt-0 bg-transparent border-white hover:bg-gray-500 text-white "
            >
              {" "}
              {backArrow}
              Regresar a Equipos
            </button>
          )}
          <Swiper
            className="w-[360px] md:w-[740px] lg:max-w-[840px]"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            breakpoints={{
              320: {
                slidesPerView: 3,
              },

              1280: {
                slidesPerView: 4,
              },
            }}
            navigation
            scrollbar={{ draggable: true }}
          >
            {filteredPlayers?.map((player) => (
              <SwiperSlide key={player.player_id}>
                <div
                  className={` md:w-44 md:h-44 w-28 h-28 rounded-md cursor-pointer border-4 flex flex-col justify-around my-4 ${
                    selectedPlayer?.player_id === player.player_id
                      ? "border-green-400"
                      : "border-gray-50"
                  } bg-white flex flex-col items-center justify-center`}
                  onClick={() => handlePlayerClick(player)}
                >
                  <img
                    src={player.player_image}
                    alt={player.player_name}
                    className="max-h-[50px] md:min-h-[90px]  md:w-full h-full object-contain "
                  />
                  <span className="text-center font-anton md:text-md text-xs font-semibold mt-2 text-black">
                    {player.player_name} <br />{" "}
                    {positionMapper[player.player_type]}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
  );
};

export default Carousel;
