import api from "./axios";


export const getExpenses = async () => {
  const response =
    await api.get("/expenses/");

  return response.data;
};


export const createExpense = async (
  expense
) => {
  const response =
    await api.post(
      "/expenses/",
      expense
    );

  return response.data;
};


export const updateExpense = async (
  id,
  expense
) => {
  const response =
    await api.put(
      `/expenses/${id}`,
      expense
    );

  return response.data;
};


export const deleteExpense = async (
  id
) => {
  const response =
    await api.delete(
      `/expenses/${id}`
    );

  return response.data;
};


export const getExpenseSummary =
  async () => {
    const response =
      await api.get(
        "/expenses/summary"
      );

    return response.data;
  };


export const getDashboard =
  async () => {
    const response =
      await api.get(
        "/expenses/dashboard"
      );

    return response.data;
  };


export const getIncomes = async () => {
  const response =
    await api.get("/incomes/");

  return response.data;
};


export const createIncome = async (
  income
) => {
  const response =
    await api.post(
      "/incomes/",
      income
    );

  return response.data;
};


export const updateIncome = async (
  id,
  income
) => {
  const response =
    await api.put(
      `/incomes/${id}`,
      income
    );

  return response.data;
};


export const deleteIncome = async (
  id
) => {
  const response =
    await api.delete(
      `/incomes/${id}`
    );

  return response.data;
};


export const getBudgets = async () => {
  const response =
    await api.get("/budgets/");

  return response.data;
};


export const createBudget = async (
  budget
) => {
  const response =
    await api.post(
      "/budgets/",
      budget
    );

  return response.data;
};


export const updateBudget = async (
  id,
  budget
) => {
  const response =
    await api.put(
      `/budgets/${id}`,
      budget
    );

  return response.data;
};


export const deleteBudget = async (
  id
) => {
  const response =
    await api.delete(
      `/budgets/${id}`
    );

  return response.data;
};