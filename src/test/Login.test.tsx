import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from "../App";
import userEvent from "@testing-library/user-event";
import firebase from "firebase/compat";
import auth = firebase.auth;

test('should renders', function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginSubmitButton).toBeInTheDocument();
});

test('should renders from Register', async function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const orLoginButton = await screen.findByTestId(/or-login-button/i);

  fireEvent.click(orLoginButton);

  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  expect(loginSubmitButton).toBeInTheDocument();
});

test('should not submit form with empty fields', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  fireEvent.click(loginSubmitButton);

  await waitFor(() => {
    expect(loginSubmitButton).toBeDisabled();
  });
});

test('should submit form with valid fields', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  fireEvent.change(emailInput, {target: {value: 'user1@gmail.com'}});
  fireEvent.change(passwordInput, {target: {value: '111111'}});

  await waitFor(() => {
    expect(loginSubmitButton).toBeEnabled();
  });
});

test('should not submit form with invalid fields', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  fireEvent.change(emailInput, {target: {value: 'user1gmail.com'}});
  fireEvent.change(passwordInput, {target: {value: '111111'}});
  fireEvent.click(loginSubmitButton);

  await waitFor(() => {
    expect(loginSubmitButton).toBeDisabled();
  });
});

test('should get Error (auth/user-not-found).', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  userEvent.type(emailInput, 'user0@gmail.com');
  userEvent.type(passwordInput, '1234567');

  await waitFor(() => {
    expect(loginSubmitButton).toBeEnabled();
  });

  userEvent.click(loginSubmitButton);

  await waitFor(() => {
    screen.getByText(/Firebase: Error \(auth\/user-not-found\)./i);
  }, {timeout: 3000});

  expect(await screen.findByText(/Firebase: Error \(auth\/user-not-found\)./i)).toBeInTheDocument();
});

test('should get Error (auth/wrong-password).', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  userEvent.type(emailInput, 'test123@gmail.com');
  userEvent.type(passwordInput, '1234567');

  await waitFor(() => {
    expect(loginSubmitButton).toBeEnabled();
  });

  userEvent.click(loginSubmitButton);

  expect(await screen.findByText(/Firebase: Error \(auth\/wrong-password\)./i, {})).toBeInTheDocument();
});


test('should login success.', async function () {

  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginSubmitButton = screen.getByTestId(/login-submit-button/i);

  userEvent.type(emailInput, 'test123@gmail.com');
  userEvent.type(passwordInput, '123456');

  await waitFor(() => {
    expect(loginSubmitButton).toBeEnabled();
  });

  userEvent.click(loginSubmitButton);

  await waitFor(() => expect(auth().currentUser).not.toBeNull(), {timeout: 3000});
  expect(await screen.findByText(/Welcome,/i, {})).toBeInTheDocument();
});
