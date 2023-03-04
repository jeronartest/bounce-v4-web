import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material'
import { useState } from 'react'
import styles from './styles'
import { ReactComponent as SearchSVG } from 'assets/imgs/companies/search.svg'
import ProjectCard from 'bounceComponents/companies/ProjectCard'

const Companies = ({}) => {
  const [type, setType] = useState('0')

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string)
  }
  return (
    <section>
      <Box sx={styles.head}>
        <Container maxWidth="lg" sx={{ pt: 53 }}>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" sx={{ width: 170 }}>
              Create a company
            </Button>
          </Stack>
          <Typography variant="h1" sx={{ color: 'var(--ps-white)', textAlign: 'center' }}>
            Top Companies
          </Typography>
          <Box sx={{ mt: 40, textAlign: 'center' }}>
            <OutlinedInput
              sx={styles.search}
              startAdornment={
                <InputAdornment position="start">
                  <SearchSVG />
                </InputAdornment>
              }
              endAdornment={
                <Button variant="contained">
                  <Typography variant="h4" component="span" fontSize={14}>
                    Search
                  </Typography>
                </Button>
              }
            />
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Paper elevation={0} sx={styles.listRoot}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontSize={24}>
              Explore
            </Typography>

            <FormControl>
              <InputLabel>Market type</InputLabel>
              <Select label="Market type" sx={{ width: 190 }} value={type} onChange={handleChange}>
                <MenuItem value="0">All types</MenuItem>
                <MenuItem value="1">Gaming</MenuItem>
                <MenuItem value="2">Defi</MenuItem>
                <MenuItem value="3">DEX</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ mt: 32 }}>
            <Grid spacing={20} container>
              {new Array(24).fill('').map((v, i) => (
                <Grid key={i} xs={3} item>
                  <ProjectCard
                    icon="/imgs/login/heartImg.png"
                    title="Dyson Project"
                    // subTitle="Gaming | Founded in Jul 2021"
                    desc="AWS provides customers with the broadest and deepest cloud platform cloud platform cloud platform the broadest and deepest cloud platform"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </section>
  )
}
export default Companies
