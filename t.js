"use client"

import React, { useState } from "react"
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material"
import dynamic from "next/dynamic"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { regions } from "../data/regions"
import { citiesByRegion } from "../data/citiesByRegion"

const Viewer = dynamic(
    () => import("@react-pdf-viewer/core").then((mod) => mod.Viewer),
    { ssr: false }
)

const Worker = dynamic(
    () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
    { ssr: false }
)
const initialState = {
    ProductId: "4607",
    InputParameters: [
        { Code: "TS_GOD", Value: "", Name: "Рік випуску" },
        { Code: "TS_INSUM", Value: "", Name: "Сума страхового внеску" },
        { Code: "TS_MARKANEW", Value: "", Name: "Марка авто" },
        { Code: "TS_MODELNEW", Value: "", Name: "Модель авто" },
        { Code: "TS_MR1", Value: "", Name: "Область" },
        { Code: "TS_MR2", Value: "", Name: "Місто" },
    ],
    GeneratePrintForm: true,
}

const FormComponent = () => {
    const [formState, setFormState] = useState(initialState)
    const [selectedRegion, setSelectedRegion] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [cities, setCities] = useState([])
    const [pdfBase64, setPdfBase64] = useState(null)

    const handleChange = (index, event) => {
        const newInputParameters = [...formState.InputParameters]
        newInputParameters[index].Value = event.target.value
        setFormState({ ...formState, InputParameters: newInputParameters })
    }

    const handleRegionChange = (event) => {
        const region = event.target.value
        setSelectedRegion(region)
        setCities(citiesByRegion[region] || [])
        const newInputParameters = [...formState.InputParameters]
        const regionIndex = newInputParameters.findIndex(
            (param) => param.Code === "TS_MR1"
        )
        newInputParameters[regionIndex].Value = region
        setFormState({ ...formState, InputParameters: newInputParameters })
    }

    const handleCityChange = (event) => {
        const city = event.target.value
        setSelectedCity(city)
        const newInputParameters = [...formState.InputParameters]
        const cityIndex = newInputParameters.findIndex(
            (param) => param.Code === "TS_MR2"
        )
        newInputParameters[cityIndex].Value = city
        setFormState({ ...formState, InputParameters: newInputParameters })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
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
                ...formState,
                InputParameters: [
                    ...formState.InputParameters,
                    { Code: "CMM_CODE", Value: "04" },
                    { Code: "TS_FRGL", Value: "01" },
                    { Code: "ctg", Value: "1" },
                ],
            }

            // Відправка основного запиту через API-роут
            const response = await fetch("/api/offerCalc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newBody, accessToken }),
            })

            if (!response.ok) {
                throw new Error("Network response was not ok")
            }

            const data = await response.json()
            setPdfBase64(data.PrintFormBase64)
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            )
        }
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Введіть дані
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                {formState.InputParameters.map((param, index) => {
                    if (param.Code === "TS_MR1") {
                        return (
                            <FormControl fullWidth key={param.Code}>
                                <InputLabel>{param.Code}</InputLabel>
                                <Select
                                    value={selectedRegion}
                                    onChange={handleRegionChange}
                                    label={param.Code}
                                >
                                    {regions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )
                    }
                    if (param.Code === "TS_MR2") {
                        return (
                            <FormControl fullWidth key={param.Code}>
                                <InputLabel>{param.Code}</InputLabel>
                                <Select
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    label={param.Code}
                                    disabled={!selectedRegion}
                                >
                                    {cities.map((city) => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )
                    }
                    return (
                        <TextField
                            key={param.Code}
                            label={param.Name}
                            value={param.Value}
                            onChange={(event) => handleChange(index, event)}
                            fullWidth
                        />
                    )
                })}
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
            {pdfBase64 && (
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        PDF документ
                    </Typography>
                    <Worker
                        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                    >
                        <Viewer
                            fileUrl={`data:application/pdf;base64,${pdfBase64}`}
                        />
                    </Worker>
                    <Button
                        variant="contained"
                        color="secondary"
                        href={`data:application/pdf;base64,${pdfBase64}`}
                        download="document.pdf"
                        sx={{ mt: 2 }}
                    >
                        Завантажити PDF
                    </Button>
                </Box>
            )}
        </Container>
    )
}

export default FormComponent
