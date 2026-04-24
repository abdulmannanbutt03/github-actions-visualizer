import axios from 'axios';

const token = process.env.REACT_APP_GITHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  },
});

export const getWorkflowRuns = async (owner, repo) => {
  const response = await api.get(`/repos/${owner}/${repo}/actions/runs?per_page=30`);
  return response.data.workflow_runs;
};

export const getJobsForRun = async (owner, repo, runId) => {
  const response = await api.get(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
  return response.data.jobs;
};

export const getWorkflows = async (owner, repo) => {
  const response = await api.get(`/repos/${owner}/${repo}/actions/workflows`);
  return response.data.workflows;
};
