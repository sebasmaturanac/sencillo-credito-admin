
import React, { useState, useEffect } from 'react'
import {
    Container,
    Typography,
    List, ListItem, ListItemText,
    Grid,
    Paper,
    TextField, Button,
} from "@mui/material";
import { toastError } from "utils/toast";
import API from 'utils/api';
import { subscribeToChats } from 'socket/socket';
import AttachFileIcon from '@mui/icons-material/AttachFile';



const ChatsPage = () => {

    const miId = sessionStorage.getItem("id");

    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuariosFiltered, setUsuariosFiltered] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [chatId, setChatId] = useState();


    const [filename, setFilename] = useState("");
    const [file, setFile] = useState(null);

    const consultarChatId = async (id2) => {

        const claveId = sessionStorage.getItem("id");

        const chatResponse = await API.post("/chat/createchat", {
            participant1Id: claveId,
            participant2Id: id2,
        });

        console.log('chatResponse ', JSON.stringify(chatResponse, null, 5))

        const idChat = await chatResponse.respuesta[0].id; // Obtener el ID del chat creado
        setChatId(idChat)
        getChats(chatResponse.respuesta[0].id)

    }
    const handleItemClick = (item) => {
        console.log('item click....', item)
        setSelectedItem(item);
        consultarChatId(item.id)
    };

    const [inputText, setInputText] = useState('');

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    useEffect(() => {

        const getUsuarios = async () => {
            try {
                setLoading(true);
                const { respuesta } = await API.get("/user");
                setUsuariosFiltered(respuesta);
                console.log('usuarios', respuesta)
                console.log('mi id ', miId)

            } catch (error) {
                toastError(error.message);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(() => {
            getUsuarios();
        }, 1000);
    }, []);

    const getChats = async (id) => {

        console.log('click....', id)
        try {
            console.log('chat id......', id)
            const { respuesta } = await API.get(`/chat/messages/${chatId !== undefined ? chatId : id}`);
            console.log('chats sokcet', JSON.stringify(respuesta, null, 5))
            setChats(respuesta)
        } catch (error) {
            console.log('chats error ')
        } finally {
            console.log('chats ok')
        }
    };

    useEffect(() => {

        subscribeToChats(getChats())

    }, [chats])

    const postChats = async () => {
        if (selectedItem === undefined || selectedItem === null) return

        const claveId = sessionStorage.getItem("id");
        if (file === null) {
            try {

                const response = await API.post("/chat/messages", {
                    "content": inputText,
                    "chatId": chatId,
                    "senderId": claveId
                });
                console.log('chats sokcet', response)
                subscribeToChats(getChats())
            } catch (error) {
                console.log('chats error ')
            } finally {
                console.log('chats ok')
                setInputText('');
            }
        } else {
            // enviar pero con form data el archivo adjunto
            // Enviar el archivo adjunto utilizando FormData
            const formData = new FormData();
            formData.append('content', inputText);
            formData.append('chatId', chatId);
            formData.append('senderId', claveId);
            formData.append('file', file); // Asegúrate de tener la variable 'file' que contiene el archivo

            try {
                const response = await API.post("/chat/messages", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('chats socket con archivo adjunto', response);
                subscribeToChats(getChats());
            } catch (error) {
                console.error('chats error con archivo adjunto', error);
            } finally {
                console.log('chats ok con archivo adjunto');
                setInputText('');
            }

        }
    };


    const attachFileChat = ({ target }) => {
        setFile(target.files[0])
        setFilename(target.files[0].name);
        console.log('archivo seleccionado', target.files[0])
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography variant="h4">Contactos</Typography>
                    {usuariosFiltered.length > 0 ? (
                        <List style={{ height: '100%', overflowY: 'auto' }}>
                            {usuariosFiltered.map((item) => (
                                <ListItem key={item.id} button onClick={() => handleItemClick(item)}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                {item.username}
                                            </Typography>
                                        } />
                                </ListItem>
                            ))}
                        </List>
                    ) : null}
                </Grid>
                <Grid item xs={12} md={6} lg={9}>
                    <Container style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
                        <Typography variant="h4">Mensajes</Typography>
                        <Paper elevation={1} style={{ flexGrow: 1, backgroundColor: '#B2BABB' }}>
                            {chats.length > 0 ? (
                                <List style={{ height: '100%', overflowY: 'auto' }}>
                                    <Paper elevation={3} style={{ backgroundColor: '#566573' }}>
                                        <Typography variant="subtitle1" textAlign="center" color="white">
                                            {selectedItem === undefined || selectedItem === null ? "MENSAJE" : selectedItem.username.toUpperCase()}
                                        </Typography>
                                    </Paper>
                                    {chats.map((item) => (
                                        <ListItem key={item.id}
                                            style={{
                                                display: 'flex',
                                                marginBottom: '0px',
                                                marginTop: '0px',
                                                paddingBottom: '1px',
                                                paddingTop: '1px',
                                                justifyContent: item.senderId === miId ? 'flex-end' : 'flex-start',
                                            }}>
                                            <div style={{ width: '100%' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column', // Para colocar contenido y recurso en columnas separadas
                                                        alignItems: parseInt(item.senderId, 10) === parseInt(miId, 10) ? 'flex-end' : 'flex-start',
                                                    }}
                                                >
                                                    <div>
                                                        <Typography
                                                            variant="body2"
                                                            align={parseInt(item.senderId, 10) === parseInt(miId, 10) ? "right" : "left"}
                                                            color={parseInt(item.senderId, 10) === parseInt(miId, 10) ? "#6E2C00" : "#154360"}>
                                                            {item.content}
                                                        </Typography>
                                                    </div>
                                                    {item.resourceLink ? (
                                                        <div>
                                                            {item.resourceLink.endsWith('.pdf') ? (
                                                                <div>
                                                                    <embed src={item.resourceLink} type="application/pdf" width="200px" height="220px" />
                                                                    <br />
                                                                    <a href={item.resourceLink} download>Descargar PDF</a>
                                                                </div>
                                                            ) : item.resourceLink.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                                <div>
                                                                    <a href={item.resourceLink} download>
                                                                        <img src={item.resourceLink} alt="Imagen" style={{ maxWidth: '200px', maxHeight: '220px' }} />
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <a href={item.resourceLink} target="_blank" rel="noopener noreferrer">Ver recurso</a>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </ListItem>
                                    ))}
                                </List>
                            ) :

                                <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold', paddingTop: '10px', paddingLeft: '10px' }}>
                                    Sin mensajes
                                </Typography>}
                        </Paper>

                        {/* Footer */}
                        <Paper elevation={3}>
                            <TextField
                                variant="outlined"
                                placeholder="Ingrese su texto aquí"
                                value={inputText}
                                onChange={handleInputChange}
                                fullWidth
                            />

                            <Paper elevation={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    style={{
                                        width: '10%', border: '2px solid #E01845',
                                        borderRadius: 6,
                                        marginRight: 1
                                    }}
                                    // startIcon={<AttachFileIcon />}
                                    sx={{ marginRight: "1rem" }}
                                    disabled={selectedItem === undefined || selectedItem === null}
                                ><AttachFileIcon />
                                    <input type="file" hidden onChange={attachFileChat} />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={postChats}
                                    style={{ width: '90%' }}
                                    disabled={selectedItem === undefined || selectedItem === null
                                    }
                                >
                                    Enviar
                                </Button>
                            </Paper>
                            <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                {filename}
                            </Typography>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ChatsPage