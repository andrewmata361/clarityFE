import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './components/copyright';
import { Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useAxios from './hooks/useAxios';
import { useEffect, useState } from 'react';
import '@fontsource/roboto';

const defaultTheme = createTheme();

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const MsgForm = () => {
  const [value, setValue] = useState(0);
  const [emailTo, setEmailTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");



  const { response, error, loading, fetchData } = useAxios();

  const clarityGet = () => {
    fetchData({ 
      url: '/api/Recipients',
      method: 'GET'
    });
  }
  const clarityPost = () => {
    fetchData({ 
      url: '/api/Recipients/Send',
      method: 'POST',
      data: {
        emailSender: "andrew@ctest.com",
        emailRecipient: emailTo,
        subject: subject,
        body: body
      }
    }).then(() => { clarityGet() });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    clarityPost();
    console.log(response);
  };

  const handleSubmitList = (event) => {
    event.preventDefault();
    clarityGet();
    console.log(response);
  };

  useEffect(() => {
    clarityGet();
  }, [clarityGet]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h" variant="h5">
            Clarity Coding Test
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth'>
            <Tab label="Send Email" {...a11yProps(0)} />
            <Tab label="Msg List" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-email"
                  name="emailTo"
                  required
                  fullWidth
                  id="emailTo"
                  label="Email To"
                  onChange={(e) => setEmailTo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="mail-subject"
                  name="subject"
                  required
                  fullWidth
                  id="subject"
                  label="Subject"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="message"
                  label="Message"
                  name="message"
                  autoComplete="message"
                  multiline
                  rows={4}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {Array.isArray(response) && response.length > 0 && response.map((item, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {item.emailRecipient} - Status: {item.sentStatus === true ? "Sent" : "Failed"}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Subject: {item.subject}
                  </Typography>
                  <Typography>
                    Body: {item.body}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          
          <Button
              onClick={handleSubmitList}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Get Recipients
            </Button>
          </CustomTabPanel>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

const App = () => {
  return (
    <MsgForm />
  );
}

export default App;
