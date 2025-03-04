"use client"
import React, { useState } from "react"
import {
    TextField,
    Button,
    Container,
    Typography,
    Grid,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    Box,
    CircularProgress,
} from "@mui/material"
import { commission } from "@/data/comision"
import { minAge } from "@/data/minAge"
import { typeOsoba } from "@/data/typeOsoba"
import { typeDocs } from "@/data/typeDocs"

const initialState = {
    agcode: null,
    ibt_id: "4425_New",
    icd_dbeg: "",
    icd_externalid: "",
    icd_commission: "",
    idp: [
        {
            code: "TS_MIN_AGE",
            value: "",
            name: "Мінімальний вік водія",
        },
    ],
    objs: {
        obj: [
            {
                code: "01",
                advp: [
                    {
                        code: "TS_N",
                        value: "",
                        name: "Реєстраційний номер",
                    },
                    {
                        code: "TS_KUZN",
                        value: "",
                        name: "VIN",
                    },
                    {
                        code: "AA_MARKA",
                        value: "",
                        name: "Марка",
                    },
                    {
                        code: "AA_MODEL",
                        value: "",
                        name: "Модель",
                    },
                    {
                        code: "TS_GOD",
                        value: "",
                        name: "Рік випуску",
                    },
                    {
                        code: "TS_MREOCities",
                        value: "",
                        name: "Місто реєстрації",
                    },
                    {
                        code: "TS_VDV",
                        value: "",
                        name: "Об'єм двигуна",
                    },
                    {
                        code: "TS_TOTAL_WEIGHT",
                        value: "",
                        name: "Максимальна маса",
                    },
                    {
                        code: "TS_OWN_WEIGHT",
                        value: "",
                        name: "Маса без навантаження",
                    },
                    {
                        code: "TS_NSEATING",
                        value: "",
                        name: "Кількість місць",
                    },
                ],
            },
        ],
        mpd: [
            {
                ctg: "",
                code: "",
                name1: "",
                name2: "",
                name3: "",
                email: "",
                mobphone: "",
                bdate: "",
                advp: [
                    {
                        code: "KL_TYPEDOC",
                        value: "",
                        name: "Тип документа",
                    },
                    {
                        code: "KLI_ADRES",
                        value: "",
                        name: "Адреса",
                    },

                    {
                        code: "PAS_SER",
                        value: "",
                        name: "Серія",
                    },

                    {
                        code: "PAS_N",
                        value: "",
                        name: "Номер",
                    },
                    {
                        code: "PAS_DATA",
                        value: "",
                        name: "Дата видачі",
                    },

                    {
                        code: "PAS_WHO",
                        value: "",
                        name: "Ким виданий",
                    },

                    {
                        code: "PAS_ID_N",
                        value: "",
                        name: "Номер",
                    },
                    {
                        code: "PAS_ID_DATE",
                        value: "",
                        name: "Дата видачі",
                    },
                    {
                        code: "PAS_ID_END",
                        value: "",
                        name: "Дата закінчення",
                    },

                    {
                        code: "PAS_ID_WHO",
                        value: "",
                        name: "Ким виданий",
                    },
                ],
            },

            {
                code: "32764382",
                name1: "",
                name2: "",
                advp: [
                    {
                        code: "AUTOSALON_NAME",
                        value: "",
                        name: "Назва автосалону",
                    },
                    {
                        code: "AUTOSALON_ABR",
                        value: "",
                        name: "Абревіатура",
                    },
                ],
            },
        ],
    },
}

export const MtplComponent = () => {
    const [formData, setFormData] = useState(initialState)

    const [serverResponse, setServerResponse] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        // console.log(name, value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
    // console.log(formData)
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
        setLoading(true)
        try {
            // Отримання токена через API-роут
            const tokenResponse = await fetch("/api/getToken", {
                method: "POST",
            })

            if (!tokenResponse.ok) {
                throw new Error("Network response was not ok")
            }

            const tokenData = await tokenResponse.json()
            const accessToken = tokenData.access_token

            const newBody = {
                ...formData,
                icd_dbeg: formData.icd_dbeg + "T00:00:00+02:00",
                icd_externalid: new Date().getTime().toString(),
            }

            const response = await fetch("/api/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newBody, accessToken }),
            })
            const result = await response.json()
            setServerResponse(result)
            setFormData(initialState)
        } catch (error) {
            console.error("Error sending data:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component={Paper} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Введіть дані договору Автоцивілка
            </Typography>
            <Box justifyContent={"center"} textAlign={"center"}>
                <Typography variant="h4" gutterBottom justifyContent={"center"}>
                    Основні дані
                </Typography>
            </Box>
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} key={"agcode"}>
                        <InputLabel>Точка продажу</InputLabel>
                        <TextField
                            // label="Точка продажу"
                            name="agcode"
                            value={formData.agcode}
                            onChange={handleChange}
                            fullWidth
                            key={"agcode"}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} key={"icd_dbeg"}>
                        <InputLabel>Дата, час початку дії договору</InputLabel>
                        <TextField
                            // label="Дата, час початку дії договору"
                            name="icd_dbeg"
                            value={formData.icd_dbeg}
                            onChange={handleChange}
                            type="date"
                            fullWidth
                            key={"icd_dbeg"}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} key={"icd_commission"}>
                        <InputLabel>Комісійна винагорода</InputLabel>
                        <Select
                            name="icd_commission"
                            value={formData.icd_commission}
                            onChange={handleChange}
                            label="Комісійна винагорода"
                            fullWidth
                            key={"icd_commission"}
                        >
                            {commission.map((commission) => (
                                <MenuItem
                                    key={commission.code}
                                    value={commission.code}
                                >
                                    {commission.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {formData.idp.map((item, index) => (
                        <Grid item xs={12} sm={6}>
                            {item.code === "TS_MIN_AGE" ? (
                                <>
                                    <InputLabel>{item.name}</InputLabel>
                                    <Select
                                        name={item.code}
                                        value={formData.idp[index].value}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                e,
                                                `idp.${index}.value`
                                            )
                                        }
                                        label={item.name}
                                        fullWidth
                                        key={index}
                                    >
                                        {minAge.map((age) => (
                                            <MenuItem
                                                key={age.code}
                                                value={age.code}
                                            >
                                                {age.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </>
                            ) : (
                                <>
                                    <InputLabel>{item.name}</InputLabel>
                                    <TextField
                                        key={index}
                                        // label={item.name}
                                        name={item.code}
                                        value={formData.idp[index].value}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                e,
                                                `idp.${index}.value`
                                            )
                                        }
                                        fullWidth
                                    />
                                </>
                            )}
                        </Grid>
                    ))}
                </Grid>
                <Box
                    justifyContent={"center"}
                    textAlign={"center"}
                    marginTop={2}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        justifyContent={"center"}
                    >
                        Дані про об'єкт страхування
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {formData.objs.obj[0].advp.map((item, index) => (
                        <Grid item xs={12} sm={6}>
                            <InputLabel>{item.name}</InputLabel>
                            <TextField
                                key={index}
                                // label={item.name}
                                name={item.code}
                                value={formData.objs.obj[0].advp[index].value}
                                onChange={(e) =>
                                    handleNestedChange(
                                        e,
                                        `objs.obj.0.advp.${index}.value`
                                    )
                                }
                                fullWidth
                            />
                        </Grid>
                    ))}
                </Grid>
                <Box
                    justifyContent={"center"}
                    textAlign={"center"}
                    marginTop={2}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        justifyContent={"center"}
                    >
                        Дані про страхувальника
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Тип страхувальника</InputLabel>
                        <Select
                            name={"ctg"}
                            value={formData.objs.mpd[0].ctg}
                            onChange={(e) =>
                                handleNestedChange(e, `objs.mpd.0.ctg`)
                            }
                            // label={item.name}
                            fullWidth
                        >
                            {typeOsoba.map((osoba) => (
                                <MenuItem key={osoba.code} value={osoba.code}>
                                    {osoba.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>ІПН</InputLabel>
                        <TextField
                            // label="ІПН"
                            name="code"
                            value={formData.objs.mpd[0].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Прізвище</InputLabel>
                        <TextField
                            // label="Прізвище"
                            name="name1"
                            value={formData.objs.mpd[0].name1}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.name1")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Ім'я</InputLabel>
                        <TextField
                            // label="Ім'я"
                            name="name2"
                            value={formData.objs.mpd[0].name2}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.name2")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>По-батькові</InputLabel>
                        <TextField
                            // label="По-батькові"
                            name="name3"
                            value={formData.objs.mpd[0].name3}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.name3")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Email</InputLabel>
                        <TextField
                            // label="Email"
                            name="email"
                            value={formData.objs.mpd[0].email}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.email")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Номер телефону</InputLabel>
                        <TextField
                            // label="Номер телефону"
                            name="mobphone"
                            value={formData.objs.mpd[0].mobphone}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.mobphone")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Дата народження</InputLabel>
                        <TextField
                            type="date"
                            name="bdate"
                            value={formData.objs.mpd[0].bdate}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.0.bdate")
                            }
                            fullWidth
                        />
                    </Grid>
                    {/* {formData.objs.mpd[0].advp.map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            {item.code === "KL_TYPEDOC" ? (
                                <>
                                    <InputLabel>{item.name}</InputLabel>
                                    <Select
                                        name={item.code}
                                        value={
                                            formData.objs.mpd[0].advp[index]
                                                .value
                                        }
                                        onChange={(e) =>
                                            handleNestedChange(
                                                e,
                                                `objs.mpd.0.advp.${index}.value`
                                            )
                                        }
                                        label={item.name}
                                        fullWidth
                                    >
                                        {typeDocs.map((doc) => (
                                            <MenuItem
                                                key={doc.code}
                                                value={doc.code}
                                            >
                                                {doc.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </>
                            ) : (
                                <>
                                    <InputLabel>{item.name}</InputLabel>
                                    <TextField
                                        name={item.code}
                                        value={
                                            formData.objs.mpd[0].advp[index]
                                                .value
                                        }
                                        onChange={(e) =>
                                            handleNestedChange(
                                                e,
                                                `objs.mpd.0.advp.${index}.value`
                                            )
                                        }
                                        fullWidth
                                    />
                                </>
                            )}
                            {formData.objs.mpd[0].advp[index].value ===
                                "04" && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Дата видачі</InputLabel>
                                        <TextField
                                            name="PAS_ID_DATE"
                                            value={
                                                formData.objs.mpd[0].advp.find(
                                                    (advp) =>
                                                        advp.code ===
                                                        "PAS_ID_DATE"
                                                ).value
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    e,
                                                    "objs.mpd.0.advp.PAS_ID_DATE.value"
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Серія та номер</InputLabel>
                                        <TextField
                                            name="PAS_ID_N"
                                            value={
                                                formData.objs.mpd[0].advp.find(
                                                    (advp) =>
                                                        advp.code === "PAS_ID_N"
                                                ).value
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    e,
                                                    "objs.mpd.0.advp.PAS_ID_N.value"
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Термін дії</InputLabel>
                                        <TextField
                                            name="PAS_ID_END"
                                            value={
                                                formData.objs.mpd[0].advp.find(
                                                    (advp) =>
                                                        advp.code ===
                                                        "PAS_ID_END"
                                                ).value
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    e,
                                                    "objs.mpd.0.advp.PAS_ID_END.value"
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Ким виданий</InputLabel>
                                        <TextField
                                            name="PAS_ID_WHO"
                                            value={
                                                formData.objs.mpd[0].advp.find(
                                                    (advp) =>
                                                        advp.code ===
                                                        "PAS_ID_WHO"
                                                ).value
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    e,
                                                    "objs.mpd.0.advp.PAS_ID_WHO.value"
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    ))} */}

                    <Grid item xs={12} sm={6} key={"KL_TYPEDOC"}>
                        <InputLabel>{"Тип документу"}</InputLabel>
                        <Select
                            name={"KL_TYPEDOC"}
                            value={
                                formData.objs.mpd[0].advp.find(
                                    (advp) => advp.code === "KL_TYPEDOC"
                                ).value
                            }
                            onChange={(e) =>
                                handleNestedChange(
                                    e,
                                    `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                        (advp) => advp.code === "KL_TYPEDOC"
                                    )}.value`
                                )
                            }
                            // label={item.name}
                            fullWidth
                        >
                            {typeDocs.map((doc) => (
                                <MenuItem key={doc.code} value={doc.code}>
                                    {doc.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {formData.objs.mpd[0].advp.find(
                        (advp) => advp.code === "KL_TYPEDOC"
                    ).value === "04" && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Дата видачі</InputLabel>
                                <TextField
                                    name="PAS_ID_DATE"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) =>
                                                advp.code === "PAS_ID_DATE"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_ID_DATE"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Серія та номер</InputLabel>
                                <TextField
                                    name="PAS_ID_N"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_ID_N"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_ID_N"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Термін дії</InputLabel>
                                <TextField
                                    name="PAS_ID_END"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_ID_END"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_ID_END"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Ким виданий</InputLabel>
                                <TextField
                                    name="PAS_ID_WHO"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_ID_WHO"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_ID_WHO"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </>
                    )}
                    {formData.objs.mpd[0].advp.find(
                        (advp) => advp.code === "KL_TYPEDOC"
                    ).value === "01" && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Серія паспорту</InputLabel>
                                <TextField
                                    name="PAS_SER"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_SER"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_SER"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Номер паспорту</InputLabel>
                                <TextField
                                    name="PAS_N"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_N"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) => advp.code === "PAS_N"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Дата видачі</InputLabel>
                                <TextField
                                    name="PAS_DATA"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_DATA"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_DATA"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Ким виданий</InputLabel>
                                <TextField
                                    name="PAS_WHO"
                                    value={
                                        formData.objs.mpd[0].advp.find(
                                            (advp) => advp.code === "PAS_WHO"
                                        ).value
                                    }
                                    onChange={(e) =>
                                        handleNestedChange(
                                            e,
                                            `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                                (advp) =>
                                                    advp.code === "PAS_WHO"
                                            )}.value`
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Адреса</InputLabel>
                        <TextField
                            name="KLI_ADRES"
                            value={
                                formData.objs.mpd[0].advp.find(
                                    (advp) => advp.code === "KLI_ADRES"
                                ).value
                            }
                            onChange={(e) =>
                                handleNestedChange(
                                    e,
                                    `objs.mpd.0.advp.${formData.objs.mpd[0].advp.findIndex(
                                        (advp) => advp.code === "KLI_ADRES"
                                    )}.value`
                                )
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Box
                    justifyContent={"center"}
                    textAlign={"center"}
                    marginTop={2}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        justifyContent={"center"}
                    >
                        Дані про автосалон
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>ЄДРПОУ</InputLabel>
                        <TextField
                            // label="ЄДРПОУ"
                            name="code"
                            value={formData.objs.mpd[1].code}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.1.code")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Повне найменування</InputLabel>
                        <TextField
                            // label="Повне найменування"
                            name="name1"
                            value={formData.objs.mpd[1].name1}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.1.name1")
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Скорочене найменування</InputLabel>
                        <TextField
                            // label="Скорочене найменування"
                            name="name2"
                            value={formData.objs.mpd[1].name2}
                            onChange={(e) =>
                                handleNestedChange(e, "objs.mpd.1.name2")
                            }
                            fullWidth
                        />
                    </Grid>
                    {formData.objs.mpd[1].advp.map((item, index) => (
                        <Grid item xs={12} sm={6}>
                            <InputLabel>{item.name}</InputLabel>
                            <TextField
                                key={index}
                                // label={item.name}
                                name={item.code}
                                value={formData.objs.mpd[1].advp[index].value}
                                onChange={(e) =>
                                    handleNestedChange(
                                        e,
                                        `objs.mpd.1.advp.${index}.value`
                                    )
                                }
                                fullWidth
                            />
                        </Grid>
                    ))}
                </Grid>
            </form>
            <Button
                variant="contained"
                color="primary"
                onClick={sendDataToServer}
                sx={{ mt: 2 }}
            >
                Створити договір
            </Button>
            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
            {serverResponse && (
                <Container component={Paper} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h6">Server Response:</Typography>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                        }}
                    >
                        {JSON.stringify(serverResponse, null, 2)}
                    </pre>
                </Container>
            )}
        </Container>
    )
}
