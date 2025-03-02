// lib/typesenseClient.js
import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [
    {
      host: "xg67d2szmnor4kcep-1.a1.typesense.net",
      port: 443, // 8108
      protocol: "https", // o 'https'
    },
  ],
  apiKey: "zgvBX0T9TA9NonvxRnmoioBeIuWvT4Ws",
  connectionTimeoutSeconds: 2,
});

export default client;

const schema = {
  name: "jobs",
  fields: [
    { name: "id", type: "string" },
    { name: "pipeline", type: "string" },
    { name: "run", type: "string" },
    { name: "seed", type: "string", optional: true },
    { name: "url", type: "string", optional: true },
    { name: "created_at", type: "string", optional: true },
    { name: "posted", type: "string", optional: true },
    { name: "company", type: "string", optional: true },
    { name: "location_country", type: "string", optional: true },
    { name: "job_title", type: "string", optional: true },
    { name: "job_time_type", type: "string", optional: true },
    { name: "num_applicants", type: "auto", optional: true },
    { name: "regex_pay_range", type: "auto", optional: true },
    { name: "seniority_level", type: "auto", optional: true },
    { name: "external_application_link", type: "string", optional: true },
    { name: "company_url", type: "string", optional: true },
    { name: "cta", type: "string", optional: true },
    { name: "pay_range_min", type: "auto", optional: true },
    { name: "pay_range_max", type: "auto", optional: true },
    { name: "regex_range_min", type: "float", optional: true },
    { name: "regex_range_max", type: "float", optional: true },
    { name: "pay_range_unit", type: "string", optional: true },
    { name: "job_id", type: "string", optional: true },
    { name: "job_board", type: "string", optional: true },
    { name: "city", type: "string", optional: true },
    { name: "state", type: "string", optional: true },
    { name: "description", type: "string", optional: true },
    { name: "isManagement", type: "string", optional: true },
    { name: "seniority", type: "string", optional: true },
    { name: "job_function_L1", type: "string", optional: true },
    { name: "isTechnical", type: "string", optional: true },
    { name: "isH1", type: "string", optional: true },
    { name: "isPublic", type: "string", optional: true },
    { name: "primary_industry", type: "string", optional: true },
    { name: "company_size", type: "string", optional: true },
  ]
};

// Create the collection
client
  .collections()
  .create(schema as any)
  .then((data) => {
    console.log("Collection created:", data);
  })
  .catch((error) => {
    console.error("Error creating collection:", error);
  });
