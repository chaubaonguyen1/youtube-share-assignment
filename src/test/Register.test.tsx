import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from "../App";
import userEvent from "@testing-library/user-event";
import firebase from "firebase/compat";
import auth = firebase.auth;

test('should renders', function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  expect(registerSubmitButton).toBeInTheDocument();
});

test('should renders from Login', async function () {
  render(<App/>);

  const loginButton = screen.getByTestId(/login-button/i);

  expect(loginButton).toBeInTheDocument();

  fireEvent.click(loginButton);

  const orRegisterButton = await screen.findByTestId(/or-register-button/i);

  fireEvent.click(orRegisterButton);

  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  expect(registerSubmitButton).toBeInTheDocument();
});

test('should not submit form with empty fields', async function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  fireEvent.click(registerSubmitButton);

  await waitFor(() => {
    expect(registerSubmitButton).toBeDisabled();
  });
});

test('should submit form with valid fields', async function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  fireEvent.change(emailInput, {target: {value: `${Math.random().toString(36).slice(2, 9)}@gmail.com`}});
  fireEvent.change(passwordInput, {target: {value: '111111'}});

  await waitFor(() => {
    expect(registerSubmitButton).toBeEnabled();
  });
});

test('should not submit form with invalid fields', async function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  fireEvent.change(emailInput, {target: {value: 'user1gmail'}});
  fireEvent.change(passwordInput, {target: {value: '111111'}});

  await waitFor(() => {
    expect(registerSubmitButton).toBeDisabled();
  });
});


test('should get Error (auth/email-already-in-use).', async function () {
  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);
  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  userEvent.type(emailInput, 'test123@gmail.com');
  userEvent.type(passwordInput, '1234567');

  await waitFor(() => {
    expect(registerSubmitButton).toBeEnabled();
  });

  userEvent.click(registerSubmitButton);

  await waitFor(() => {
    screen.getByText(/Firebase: Error \(auth\/email-already-in-use\)./i);
  }, {timeout: 3000});

  expect(await screen.findByText(/Firebase: Error \(auth\/email-already-in-use\)./i, {})).toBeInTheDocument();
});


test('should register success', async function () {

  render(<App/>);

  const registerButton = screen.getByTestId(/register-button/i);

  expect(registerButton).toBeInTheDocument();

  fireEvent.click(registerButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerSubmitButton = screen.getByTestId(/register-submit-button/i);

  userEvent.type(emailInput, `${Math.random().toString(36).slice(2, 9)}@gmail.com`);
  userEvent.type(passwordInput, '111111');

  await waitFor(() => {
    expect(registerSubmitButton).toBeEnabled();
  });

  userEvent.click(registerSubmitButton);

  await waitFor(() => expect(auth().currentUser).not.toBeNull(), {timeout: 3000});
  expect(await screen.findByText(/Welcome,/i, {})).toBeInTheDocument();
});
