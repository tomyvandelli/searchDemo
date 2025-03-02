<script>
  import client from "../lib/typesenseClient";

  let searchParams = {
    inclusion: {
      company: "",
      job_title: "",
      city: "",
      state: "",
      job_function_L1: "",
      seniority: "",
      primary_industry: "",
      company_size: "",
    },
    exclusion: {
      company: "",
      job_title: "",
      city: "",
      state: "",
      job_function_L1: "",
      seniority: "",
      primary_industry: "",
      company_size: "",
    },
  };

  let results = [];
  let error = "";
  let currentPage = 1;
  let perPage = 10;
  let hasMoreResults = true;

  async function search(reset = true) {
    try {
      if (reset) {
        currentPage = 1;
        results = [];
      }

      let filterQuery = buildTypesenseQuery(searchParams.inclusion, searchParams.exclusion);
      const searchResults = await client
        .collections("jobs")
        .documents()
        .search({
          q: "*",
          query_by: "company,job_title,city,state,job_function_L1,seniority,primary_industry,company_size",
          filter_by: filterQuery,
          per_page: perPage,
          page: currentPage,
        });

      if (searchResults.hits.length < perPage) {
        hasMoreResults = false;
      } else {
        hasMoreResults = true;
      }

      results = [...results, ...searchResults.hits.map(hit => hit.document)];
    } catch (err) {
      error = err.message;
      console.error("Search error:", err);
    }
  }

  async function loadMore() {
    currentPage++;
    await search(false);
  }

  function buildTypesenseQuery(inclusion, exclusion) {
    let filters = [];

    for (const key in inclusion) {
      if (inclusion[key]) filters.push(`${key}:=[${inclusion[key]}]`);
    }

    for (const key in exclusion) {
      if (exclusion[key]) filters.push(`${key}:!=[${exclusion[key]}]`);
    }

    return filters.length > 0 ? filters.join(" && ") : "";
  }
</script>

<main>
  <h1>🔍 Find Your Dream Job</h1>

  <div class="filters-container">
    <div class="column">
      <h2>🎯 Inclusion Filters</h2>
      {#each Object.keys(searchParams.inclusion) as field}
        <input type="text" bind:value={searchParams.inclusion[field]} placeholder={`Search ${field.replace("_", " ")}`} />
      {/each}
    </div>

    <div class="column">
      <h2>🚫 Exclusion Filters</h2>
      {#each Object.keys(searchParams.exclusion) as field}
        <input type="text" bind:value={searchParams.exclusion[field]} placeholder={`Exclude ${field.replace("_", " ")}`} />
      {/each}
    </div>
  </div>

  <button on:click={search} class="search-btn">🔎 Search</button>

  <div class="results">
    {#if results.length > 0}
      <ul class="job-list">
        {#each results as result}
          <li class="job-card">
            <div class="job-header">
              <h3>{result.job_title}</h3>
              <span class="company-name">{result.company}</span>
            </div>
            <div class="job-details">
              <p><strong>📍 Location:</strong> {result.city}, {result.state}</p>
              <p><strong>🏢 Industry:</strong> {result.primary_industry}</p>
              <p><strong>📊 Seniority:</strong> {result.seniority}</p>
              <p><strong>🔧 Job Function:</strong> {result.job_function_L1}</p>
              <p><strong>👥 Company Size:</strong> {result.company_size}</p>
            </div>
            <a href={result.external_application_link} target="_blank" class="apply-btn">🚀 Apply Now</a>
          </li>
        {/each}
      </ul>
    {/if}

    {#if results.length == 0 && error.length == 0}
      <p class="error">⚠️ No results found</p>
    {/if}
    {#if error}
      <p class="error">❌ {error}</p>
    {/if}
  </div>

  {#if hasMoreResults}
    <button on:click={loadMore} class="load-more">⬇️ Load More</button>
  {/if}
</main>

<style>
  body {
    font-family: "Poppins", sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
    color: #333;
  }

  h1 {
    text-align: center;
    margin: 20px 0;
    font-size: 2rem;
    color: #007bff;
  }

  .filters-container {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  input {
    padding: 10px;
    width: 300px;
    border: 2px solid #007bff;
    border-radius: 8px;
    font-size: 1rem;
  }

  .search-btn {
    display: block;
    margin: 20px auto;
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.3s;
  }

  .search-btn:hover {
    background-color: #0056b3;
  }

  .results {
    max-width: 900px;
    margin: 20px auto;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .job-list {
    list-style-type: none;
    padding: 0;
  }

  .job-card {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .company-name {
    font-size: 1rem;
    color: #777;
  }

  .job-details p {
    margin: 5px 0;
    font-size: 1rem;
  }

  .apply-btn {
    display: block;
    text-align: center;
    padding: 12px;
    background-color: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 1.1rem;
    margin-top: 15px;
  }

  .apply-btn:hover {
    background-color: #218838;
  }

  .load-more {
    display: block;
    margin: 20px auto;
    padding: 12px 24px;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
  }

  .load-more:hover {
    background-color: #0056b3;
  }

  .error {
    color: red;
    text-align: center;
    font-size: 1.2rem;
    margin-top: 2rem;
  }
</style>
