import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedFundData, getSelectedFundName, getSelectedFundCode, fetchMFData } from '../features/selected/selectedSlice';
import csvDownload from 'json-to-csv-export';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Search from './Search';
import Chart from './Chart';

const ChartWrapper = ({ isin }) => {
  const dispatch = useDispatch();
  const selectedFundData = useSelector(getSelectedFundData);
  const selectedFundName = useSelector(getSelectedFundName);
  const selectedFundCode = useSelector(getSelectedFundCode);
  const [schemaDetails, setSchemaDetails] = useState(null);

  useEffect(() => {
    if (selectedFundData.length > 0) {
      fetchSchema(selectedFundCode);
    }
  }, [selectedFundCode]);

  const fetchSchema = async (code) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-schema?isin=${isin}`);
      if (response.ok) {
        const data = await response.json();
        setSchemaDetails(data);
        console.log('Schema data fetched:', data);

        const presetFund = {
          schemeName: data.schemaName,
          schemeCode: data.schemaCode
        };

        console.log('Dispatching fetchMFData with presetFund:', presetFund);
        await dispatch(fetchMFData(presetFund));

        localStorage.setItem("selectedFund", JSON.stringify(presetFund));
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch schema:', errorData.error);
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };

  const handleDownload = () => {
    const dataToConvert = {
      data: selectedFundData,
      filename: `${selectedFundName}_${selectedFundCode}_historical-nav-data_${new Date().toISOString().slice(0, 10)}`,
      delimiter: ',',
      headers: ["Date", "NAV"]
    }
    csvDownload(dataToConvert);
  };

  return (
    <Box sx={{ flexGrow: 1, m: "10px" }}>
      <Search />
      <Box sx={{ display: "flex", height: { xs: "calc(100dvh - 120px)", md: "calc(100dvh - 320px)" }, minHeight: 490, maxHeight: 640, backgroundColor: "background.contrast", borderRadius: "5px", color: "text.secondary", flexDirection: "column" }}>
        <Box sx={{ display: "flex", px: "8px", alignItems: "center", minHeight: "50px", borderBottom: 1, borderBottomColor: "border.secondary", justifyContent: "space-between" }}>
          <Typography variant="body1" component="div" sx={{ fontWeight: "bold", mx: "5px" }}>Historical NAV Chart</Typography>
          <Button aria-label="close" variant="outlined" size="small" endIcon={<DownloadIcon />}
            disabled={!selectedFundData.length > 0} onClick={handleDownload}>
            Download CSV
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 1, minHeight: 430, justifyContent: "center", alignItems: "center" }}>
          <Chart />
        </Box>
      </Box>
    </Box>
  );
};

export default ChartWrapper;
