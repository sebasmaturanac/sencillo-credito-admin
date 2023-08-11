
import React, { useState, useEffect } from 'react'
import {
    Container,
    Typography,
    List, ListItem, ListItemText,
    Grid,
    Paper,
    TextField, Button
} from "@mui/material";
import { toastError, toastSuccess } from "utils/toast";
import API from 'utils/api';
import { subscribeToChats } from 'socket/socket';



const ChatsPage = () => {


    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuariosFiltered, setUsuariosFiltered] = useState([]);
    const [selectedItem, setSelectedItem] = useState();

    const handleItemClick = (item) => {
        setSelectedItem(item);
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
                console.log('log : ', respuesta)
                setUsuariosFiltered(respuesta);
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

    const getChats = async () => {
        try {
            const { respuesta } = await API.get("/chat/messages");
            console.log('chats sokcet', respuesta)
            setChats(respuesta)
        } catch (error) {
            console.log('chats error ')
        } finally {
            console.log('chats ok')
        }
    };

    useEffect(() => {

        subscribeToChats(getChats())

    }, [])

    const postChats = async () => {
        if (selectedItem === undefined || selectedItem === null) return
        try {
            const response = await API.post("/chat/messages", {
                "content": inputText
            });
            console.log('chats sokcet', response)
            subscribeToChats(getChats())
        } catch (error) {
            console.log('chats error ')
        } finally {
            console.log('chats ok')
            setInputText('');
        }
    };

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={3}>
                    <Typography variant="h4">Contactos</Typography>
                    {usuariosFiltered.length > 0
                        ? <List style={{ height: '100%', overflowY: 'auto' }}>
                            {usuariosFiltered.map((item) => (
                                <ListItem key={item.id} button onClick={() => handleItemClick(item)}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                {item.username}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List> : null}
                </Grid>
                <Grid item xs={12} md={6} lg={9}>
                    <Container style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
                        <Typography variant="h4">Mensajes</Typography>
                        <Paper elevation={1} style={{ flexGrow: 1, backgroundColor: '#B2BABB' }}>
                            {chats.length > 0
                                ? <List style={{ height: '100%', overflowY: 'auto' }}>
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
                                          }}>
                                            <ListItemText
                                                primary={
                                                    <Typography 
                                                        variant="body2" 
                                                        align={item.content === 'mi mensaje' ? "right" : "left"}
                                                        color={item.content === 'mi mensaje' ? "#6E2C00" : "#154360"}>
                                                        {item.content}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={postChats}
                                style={{ width: '100%' }}
                                disabled={selectedItem === undefined || selectedItem === null
                                }
                            >
                                Enviar
                            </Button>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ChatsPage