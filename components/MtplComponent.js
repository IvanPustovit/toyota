"use client"
import React, { useState } from "react"
import {
    TextField,
    Button,
    Container,
    Typography,
    Grid,
    Paper,
} from "@mui/material"

const initialState = {
    agcode: "147100",
    ibt_id: "4425_New",
    icd_dbeg: "2025-01-15T00:00:00+02:00",
    icd_externalid: "16790746-baaa-471b-9357-13344a24a75d",
    icd_commission: "01",
    idp: [
        {
            code: "TS_MIN_AGE",
            value: "02",
        },
        {
            code: "TS_MAX_AGE",
            value: "01",
        },
        {
            code: "ZPV_NMD_NEW",
            value: "100",
        },
    ],
    objs: {
        obj: [
            {
                code: "02",
                advp: [
                    {
                        code: "TS_N",
                        value: "АА1111АА",
                    },
                    {
                        code: "TS_KUZN",
                        value: "ZCFC50A2105752930",
                    },
                    {
                        code: "TS_MARKAVANNEW",
                        value: "1",
                    },
                    {
                        code: "TS_MODELVANNEW",
                        value: "02_1_1",
                    },
                    {
                        code: "TS_GOD",
                        value: "2022",
                    },
                    {
                        code: "TS_MREOCities",
                        value: "230",
                    },
                    {
                        code: "TS_VDV",
                        value: "30",
                    },
                    {
                        code: "TS_TOTAL_WEIGHT",
                        value: "2500",
                    },
                    {
                        code: "TS_OWN_WEIGHT",
                        value: "2000",
                    },
                    {
                        code: "TS_NSEATING",
                        value: "5",
                    },
                    {
                        code: "TS_USE_SPHERE",
                        value: "09",
                    },
                ],
            },
        ],
        mpd: [
            {
                ctg: "2",
                code: "3682406609",
                name1: "Філоненко",
                name2: "Анна",
                name3: "Ігорівна",
                namelat: "Filonenko",
                namelatshort: "Anna",
                email: "anna.filonenko@uniqa.ua",
                mobphone: "+380674077636",
                bdate: "2000-10-26T00:00:00+03:00",
                advp: [
                    {
                        code: "KL_TYPEDOC",
                        value: "04",
                    },
                    {
                        code: "KLI_ADRES",
                        value: "Київ (Київська), вапаеикм",
                    },

                    {
                        code: "PAS_ID_DATE",
                        value: "29.04.2021",
                    },
                    {
                        code: "PAS_ID_N",
                        value: "356547636",
                    },
                    {
                        code: "PAS_ID_END",
                        value: "29.04.2031",
                    },
                    {
                        code: "PAS_ID_WHO",
                        value: "3213",
                    },
                ],
            },

            {
                code: "32764382",
                name1: "ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ „СЕРВІСНИЙ ЦЕНТР „ДІАМАНТ”",
                name2: "ТЗОВ „СЕРВІСНИЙ ЦЕНТР „ДІАМАНТ”",
                advp: [
                    {
                        code: "AUTOSALON_NAME",
                        value: 'Тойота Центр Львів "Діамант"',
                    },
                    {
                        code: "AUTOSALON_ABR",
                        value: "DM",
                    },
                ],
            },
        ],
    },
}


export const MtplComponent = () => {
    const [formData, setFormData] = useState(initialState)

    const [serverResponse, setServerResponse] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleNestedChange = (e, path) => {
        const { name, value } = e.target
        const keys = path.split(".")
        setFormData((prevData) => {
            const newData = { ...prevData }
            let current = newData
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value
                } else {
                    current = current[key]
                }
            })
            return newData
        })
    }

    const sendDataToServer = async () => {
        try {
            const response = await fetch(
                "https://your-server-endpoint.com/api",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            )
            const result = await response.json()
            setServerResponse(result)
        } catch (error) {
            console.error("Error sending data:", error)
        }
    }

    return (
        <Container component={Paper} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Введіть дані
            </Typography>
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="agcode"
                            name="agcode"
                            value={formData.agcode}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ibt_id"
                            name="ibt_id"
                            value={formData.ibt_id}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="icd_dbeg"
                            name="icd_dbeg"
                            value={formData.icd_dbeg}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="icd_externalid"
                            name="icd_externalid"
                            value={formData.icd_externalid}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="icd_commission"
                            name="icd_commission"
                            value={formData.icd_commission}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="idp code"
                            name="idp.code"
                            value={formData.idp[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "idp.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="idp value"
                            name="idp.value"
                            value={formData.idp[0].value}
                            onChange={(e) =>
                                handleNestedChange(e, "idp.0.value")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="obj code"
                            name="objs.obj.code"
                            value={formData.objs.obj[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.obj.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="advp code"
                            name="objs.obj.advp.code"
                            value={formData.objs.obj[0].advp[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.obj.0.advp.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="advp value"
                            name="objs.obj.advp.value"
                            value={formData.objs.obj[0].advp[0].value}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.obj.0.advp.0.value")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="mpd code"
                            name="objs.mpd.code"
                            value={formData.objs.mpd[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="mpd name1"
                            name="objs.mpd.name1"
                            value={formData.objs.mpd[0].name1}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.name1")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="mpd name2"
                            name="objs.mpd.name2"
                            value={formData.objs.mpd[0].name2}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.name2")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="mpd advp code"
                            name="objs.mpd.advp.code"
                            value={formData.objs.mpd[0].advp[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.advp.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="mpd advp value"
                            name="objs.mpd.advp.value"
                            value={formData.objs.mpd[0].advp[0].value}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.advp.0.value")
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </form>
            <Button
                variant="contained"
                color="primary"
                onClick={sendDataToServer}
                sx={{ mt: 2 }}
            >
                Send Data
            </Button>
            {serverResponse && (
                <Paper sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6">Server Response:</Typography>
                    <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
                </Paper>
            )}
        </Container>
    )
}
