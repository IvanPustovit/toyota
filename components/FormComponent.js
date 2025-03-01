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
    CircularProgress,
} from "@mui/material"
import dynamic from "next/dynamic"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { regions } from "../data/regions"
import { citiesByRegion } from "../data/citiesByRegion"
import { commission } from "@/data/comision"

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
        { Code: "CMM_CODE", Value: "", Name: "Комісійна винагорода" },
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
    const [selectedCommission, setSelectedCommission] = useState("")
    const [cities, setCities] = useState([])
    const [pdfBase64, setPdfBase64] = useState(null)
    const [loading, setLoading] = useState(false)

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
    const handleCommission = (event) => {
        const commission = event.target.value
        setSelectedCommission(commission)
        const newInputParameters = [...formState.InputParameters]
        const commissionIndex = newInputParameters.findIndex(
            (param) => param.Code === "CMM_CODE"
        )
        newInputParameters[commissionIndex].Value = commission
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
                ...formState,
                InputParameters: [
                    ...formState.InputParameters,
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Отримання пропозиції по страхуванню КАСКО для юридичних осіб
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                {formState.InputParameters.map((param, index) => {
                    if (param.Code === "CMM_CODE") {
                        return (
                            <FormControl fullWidth key={param.Code}>
                                <InputLabel>{param.Name}</InputLabel>
                                <Select
                                    value={selectedCommission}
                                    onChange={handleCommission}
                                    label={param.Name}
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
                            </FormControl>
                        )
                    }
                    if (param.Code === "TS_MR1") {
                        return (
                            <FormControl fullWidth key={param.Code}>
                                <InputLabel>{param.Name}</InputLabel>
                                <Select
                                    value={selectedRegion}
                                    onChange={handleRegionChange}
                                    label={param.Name}
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
                                <InputLabel>{param.Name}</InputLabel>
                                <Select
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    label={param.Name}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    Отримати пропозицію
                </Button>
            </Box>
            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
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
