import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(cors());

const url1 = "https://moengage.zendesk.com/api/v2/search.json"; // for items
const url2 = "https://moengage.zendesk.com/api/v2/search/count"; // for count
const url3 =
  "https://moengage.zendesk.com/api/v2/group_slas/policies/definitions"; // for policies
const url4 = "https://moengage.zendesk.com/api/v2/ticket_metrics";
const url5 = "https://moengage.zendesk.com/api/api/v2/ticket_audits";

const auth = {
  username: "arpit.kapoor@moengage.com" + "/token",
  password: "5spNtwV34lPlAPKsWfMN7z0lXpbCdHXiWOyaMbH1",
};

// const fetchDetails = async () => {
//   const params = {
//     query: "type:ticket status:solved solved>1months", // Solved tickets last month
//   };

//   const response = await axios.get(url1, { params, auth });
//   console.log(response.data.results.length);
//   console.log(response.data.results[1]);

//   return response.data;
// };

// DONE APIS

const getTotalCreatedTickets = async (startDate, endDate) => {
  const params = {
    query: `type:ticket created>=${startDate} created<=${endDate}`,
  };

  const response = await axios.get(url2, { params, auth });
  return response.data;
};

const getTicketsWithType = async (startDate, endDate, priorityType) => {
  const params = {
    query: `type:ticket created>=${startDate} created<=${endDate} priority:${priorityType}`,
  };

  const response = await axios.get(url2, { params, auth });
  return response.data;
};

const getAudit = async () => {
  // const params = {
  //   query: "type:ticket status:solved solved>1months", // Solved tickets last month
  // };

  const response = await axios.get(url5, { auth });

  return response.data;
};

// for fetching count
const fetchCount = async () => {
  const params = {
    query: "type:ticket status:solved solved>1months", // Solved tickets last month
  };

  const response = await axios.get(url2, { params, auth });

  return response.data;
};

const getTicketById = async () => {
  const params = {
    query: "type:ticket 252666", // Solved tickets last month
  };

  const response = await axios.get(url1, { params, auth });

  return response.data;
};

const fetchCustom = async () => {
  const params = {
    query:
      "type:ticket status:solved solved>1months custom_field_360021184412:mid_market  ", // Solved tickets last month
  };

  const response = await axios.get(url2, { params, auth });

  return response.data;
};

const fetchDsat = async () => {
  const params = {
    query: "type:ticket status:solved solved>2025-01-05 satisfaction:offered  ", // Solved tickets last month
  };

  const response = await axios.get(url2, { params, auth });

  return response.data;
};

const policies = async () => {
  const response = await axios.get(url3, { auth });

  return response.data;
};

const metrics = async () => {
  const response = await axios.get(url4, { auth });
  console.log(response.data.ticket_metrics.length);

  return response.data;
};

///////////////////////////////////////ENDPOINTS

// DONE EndPoints
let resultObject = {};

app.get("/getTotalCreatedTickets", async (req, res) => {
  const { startDate, endDate } = req.query;
  const result = await getTotalCreatedTickets(startDate, endDate);
  resultObject.totalTickets = result.count;
  console.log(resultObject);

  res.json(result);
});

app.get("/getTicketsWithType", async (req, res) => {
  const { startDate, endDate, priorityType } = req.query;
  const result = await getTicketsWithType(startDate, endDate, priorityType);
  res.json(result);
});

app.get("/ticket", async (req, res) => {
  const result = await fetchDetails();
  //console.log(result);
  res.json(result.results[0]);
});

app.get("/count", async (req, res) => {
  const result = await fetchCount();
  //console.log(result);
  res.json(result);
});

// count for mm fetch

app.get("/custommm", async (req, res) => {
  const result = await fetchCustom();
  //console.log(result);
  res.json(result);
});

app.get("/getAudit", async (req, res) => {
  const result = await getAudit();
  //console.log(result);
  res.json(result);
});

//dsat
app.get("/custommm", async (req, res) => {
  const result = await fetchCustom();
  //console.log(result);
  res.json(result);
});

app.get("/fetchdsat", async (req, res) => {
  const result = await fetchDsat();
  //console.log(result);
  res.json(result);
});

app.get("/policies", async (req, res) => {
  const result = await policies();
  //console.log(result);
  res.json(result);
});

app.get("/metrics", async (req, res) => {
  const result = await metrics();
  //console.log(result);
  res.json(result);
});

app.get("/getTicketById", async (req, res) => {
  const result = await getTicketById();
  //console.log(result);
  res.json(result);
});

// app.get("/hello", async (req, res) => {
//   res.send("Hello");
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
