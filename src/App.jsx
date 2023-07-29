import { useEffect, useState, useRef } from "react";

// import do loader
import Lottie from "lottie-react";
import Loader from "./assets/loader.json";

// import de ícones
import { Trash, MusicNotesPlus, X } from "@phosphor-icons/react";

// import de components
import Header from "./components/Header";
import Modal from "./components/Modal";

// import de services
import api from "./services/api";
import formatDuration from "./services/formatDuration";

//--------------------------------------------------------------------------------

function App() {
  // Hooks que salva os álbuns e é usado para listar ------------------------
  const [albuns, setAlbuns] = useState([]);

  // Hook para loader ------------------------
  const [isLoading, setIsLoading] = useState(false);

  // Hook para álbum atual ao adicionar nova faixa ------------------------
  const [currentAlbum, setCurrentAlbum] = useState({});

  // Hooks para modal ------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isNewSongModal, setIsNewSongModal] = useState(false);

  // Hooks de input com useRef ------------------------
  const search = useRef("");
  const newAlbum = useRef("");
  const newAlbumYear = useRef("");
  const newSong = useRef("");
  const newSongDuration = useRef("");

  // Pega todos dados da API ------------------------------------------
  async function getData(param) {
    try {
      setIsLoading(true);
      const response = await api.get(param);
      setAlbuns(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete álbum ou faixa ------------------------------------------
  async function deleteItem(param, id) {
    try {
      setIsLoading(true);
      const response = await api.delete(`${param}/${id}`);
      getData("album");
    } catch (error) {
      console.error(error);
    }
  }

  // Cria um novo álbum ------------------------------------------
  async function createAlbum(albumName, AlbumYear) {
    try {
      setIsLoading(true);
      const response = await api.post("album", {
        name: albumName,
        year: AlbumYear,
      });
      getData("album");
      setIsOpen(!isOpen);
    } catch (error) {
      console.error(error);
    }
  }

  // Cria uma nova faixa ------------------------------------------
  async function createTrack(albumId, number, title, duration) {
    try {
      setIsLoading(true);
      const response = await api.post("track", {
        album_id: albumId,
        number: number,
        title: title,
        duration: duration,
      });
      getData("album");
      setIsNewSongModal(!isNewSongModal);
    } catch (error) {
      console.error(error);
    }
  }

  // Carrega os dados da API ao abrir a janela ---------------------------
  useEffect(() => {
    getData("album");
  }, []);

  return (
    <div className="App">
      {isOpen && (
        <Modal
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <h1>Criar álbum</h1>
          <input
            ref={newAlbum}
            type="text"
            id="nome"
            placeholder="Nome do álbum"
          />

          <input
            ref={newAlbumYear}
            type="text"
            id="ano"
            placeholder="Ano do álbum"
          />
          <button
            onClick={() => {
              if (
                albuns.filter(
                  (album) =>
                    album.name.toLowerCase() ===
                    newAlbum.current.value.toLowerCase()
                ).length == 0 &&
                newAlbum.current.value.length > 0 &&
                newAlbumYear.current.value.length == 4 &&
                newAlbumYear.current.value > 0
              ) {
                createAlbum(newAlbum.current.value, newAlbumYear.current.value);
              } else {
                alert("Entrada inválida!");
              }

              setIsOpen(!isOpen);
            }}
            className="add"
          >
            Criar
          </button>
        </Modal>
      )}

      {isNewSongModal && (
        <Modal
          onClick={() => {
            setIsNewSongModal(!isNewSongModal);
            setCurrentAlbum({});
          }}
        >
          <h1>Nova faixa</h1>
          <input
            ref={newSong}
            type="text"
            id="nome"
            placeholder="Nome da faixa"
          />
          <input
            ref={newSongDuration}
            type="text"
            id="ano"
            placeholder="Duração da faixa"
          />
          <button
            onClick={() => {
              if (
                currentAlbum.tracks.filter(
                  (track) =>
                    track.title.toLowerCase() ===
                    newSong.current.value.toLowerCase()
                ).length == 0 &&
                newSong.current.value.length > 0 &&
                newSongDuration.current.value < 3599 &&
                newSongDuration.current.value > 0
              ) {
                createTrack(
                  currentAlbum.id,
                  currentAlbum.number,
                  newSong.current.value,
                  newSongDuration.current.value
                );
                setCurrentAlbum({});
              } else {
                alert("Entrada inválida!");
              }

              setIsNewSongModal(!isNewSongModal);
            }}
            className="add"
          >
            Criar
          </button>
        </Modal>
      )}

      <div className="container">
        <Header />
        <div className="busca">
          <label htmlFor="search">Digite uma palavra chave</label>
          <div className="searchBox">
            <input ref={search} type="text" id="search" placeholder="Min" />
            <button
              onClick={() => {
                if (!search.current.value) {
                  getData("album");
                }
                getData(
                  `album?keyword=${search.current.value}&limit=10&page=1`
                );
                search.current.value = "";
              }}
            >
              Procurar
            </button>
          </div>
        </div>

        <div className="list">
          {!isLoading && albuns.length == 0 && <h1>Nada encontrado!</h1>}

          {isLoading ? (
            <Lottie className="loader" animationData={Loader} loop={true} />
          ) : (
            albuns.map((album, index) => {
              return (
                <div className="album" key={index}>
                  <h1>
                    Álbum: {album.name}, {album.year}
                    <button>
                      <MusicNotesPlus
                        onClick={() => {
                          let idNumber = album.tracks.length + 1;
                          if (album.tracks.length > 0) {
                            idNumber =
                              album.tracks[album.tracks.length - 1].number + 1;
                          }
                          setCurrentAlbum({
                            id: album.id,
                            number: idNumber,
                            tracks: album.tracks,
                          });
                          setIsNewSongModal(!isNewSongModal);
                        }}
                        size={30}
                        color="#0b0e0a"
                      />
                    </button>
                    <button onClick={() => deleteItem("album", album.id)}>
                      <Trash size={30} color="#ac1818" />
                    </button>
                  </h1>
                  <table>
                    <tbody>
                      <tr>
                        <th>Nº</th>
                        <th>Faixa</th>
                        <th className="duration">Duração</th>
                      </tr>

                      {album.tracks.map((song, i) => {
                        return (
                          <tr className="song" key={i}>
                            {/* Não estou utilizando o number real da faixa, para poder listar sempre em ordem de inserção */}
                            <td>{i + 1}</td>
                            <td className="nameSong">
                              {song.title}
                              <button
                                onClick={() => deleteItem("track", song.id)}
                              >
                                <X size={20} color="#ac1818" />
                              </button>
                            </td>
                            <td className="duration">
                              {formatDuration(song.duration)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>

        <button className="newAlbum" onClick={() => setIsOpen(!isOpen)}>
          Novo álbum
        </button>
      </div>
    </div>
  );
}

export default App;
