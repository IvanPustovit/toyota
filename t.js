;<Grid item xs={12} sm={6} key={index}>
    <InputLabel>{"Тип документу"}</InputLabel>
    <Select
        name={"KL_TYPEDOC"}
        value={formData.objs.mpd[0].advp[index].value}
        onChange={(e) =>
            handleNestedChange(e, `objs.mpd.0.advp.${index}.value`)
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

    {formData.objs.mpd[0].advp[index].value === "04" && (
        <>
            <Grid item xs={12} sm={6}>
                <InputLabel>Дата видачі</InputLabel>
                <TextField
                    name="PAS_ID_DATE"
                    value={
                        formData.objs.mpd[0].advp.find(
                            (advp) => advp.code === "PAS_ID_DATE"
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
                            (advp) => advp.code === "PAS_ID_N"
                        ).value
                    }
                    onChange={(e) =>
                        handleNestedChange(e, "objs.mpd.0.advp.PAS_ID_N.value")
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
                            (advp) => advp.code === "PAS_ID_WHO"
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
