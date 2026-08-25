const API_BASE_URL = "http://127.0.0.1:8000";

const getToken = () => {
  return localStorage.getItem("token") || "";
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        `Request failed: ${response.status}`
    );

    error.response = {
      status: response.status,
      data,
    };

    throw error;
  }

  return {
    data,
    status: response.status,
  };
};

export const signup = async (payload) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const login = async (email, password) => {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        "Login failed"
    );

    error.response = {
      status: response.status,
      data,
    };

    throw error;
  }

  return {
    data,
    status: response.status,
  };
};

export const getCurrentUser = async () => {
  return request("/auth/me");
};

export const getExpenses = async () => {
  return request("/expenses/");
};

export const createExpense = async (expense) => {
  return request("/expenses/", {
    method: "POST",
    body: JSON.stringify(expense),
  });
};

export const getExpense = async (expenseId) => {
  return request(`/expenses/${expenseId}`);
};

export const updateExpense = async (
  expenseId,
  expense
) => {
  return request(`/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(expense),
  });
};

export const deleteExpense = async (expenseId) => {
  return request(`/expenses/${expenseId}`, {
    method: "DELETE",
  });
};

export const getExpenseSummary = async () => {
  return request("/expenses/summary");
};

export const getDashboard = async () => {
  return request("/expenses/dashboard");
};

export const getIncomes = async () => {
  return request("/incomes/");
};

export const createIncome = async (income) => {
  return request("/incomes/", {
    method: "POST",
    body: JSON.stringify(income),
  });
};

export const getIncome = async (incomeId) => {
  return request(`/incomes/${incomeId}`);
};

export const updateIncome = async (
  incomeId,
  income
) => {
  return request(`/incomes/${incomeId}`, {
    method: "PUT",
    body: JSON.stringify(income),
  });
};

export const deleteIncome = async (incomeId) => {
  return request(`/incomes/${incomeId}`, {
    method: "DELETE",
  });
};

export const getBankAccounts = async () => {
  return request("/bank-accounts/");
};

export const createBankAccount = async (
  bankAccount
) => {
  return request("/bank-accounts/", {
    method: "POST",
    body: JSON.stringify(bankAccount),
  });
};

export const getBankAccount = async (
  bankAccountId
) => {
  return request(`/bank-accounts/${bankAccountId}`);
};

export const updateBankAccount = async (
  bankAccountId,
  bankAccount
) => {
  return request(`/bank-accounts/${bankAccountId}`, {
    method: "PUT",
    body: JSON.stringify(bankAccount),
  });
};

export const deleteBankAccount = async (
  bankAccountId
) => {
  return request(`/bank-accounts/${bankAccountId}`, {
    method: "DELETE",
  });
};

export const getBudgets = async () => {
  return request("/budgets/");
};

export const createBudget = async (budget) => {
  return request("/budgets/", {
    method: "POST",
    body: JSON.stringify(budget),
  });
};

export const getBudget = async (budgetId) => {
  return request(`/budgets/${budgetId}`);
};

export const updateBudget = async (
  budgetId,
  budget
) => {
  return request(`/budgets/${budgetId}`, {
    method: "PUT",
    body: JSON.stringify(budget),
  });
};

export const deleteBudget = async (budgetId) => {
  return request(`/budgets/${budgetId}`, {
    method: "DELETE",
  });
};

export const getReports = async () => {
  return request("/reports/");
};

export const exportReportsCSV = async () => {
  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/reports/export`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    const error = new Error(
      data?.detail ||
        data?.message ||
        `Request failed: ${response.status}`
    );

    error.response = {
      status: response.status,
      data,
    };

    throw error;
  }

  const data = await response.blob();

  return {
    data,
    status: response.status,
  };
};