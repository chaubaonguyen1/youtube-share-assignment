import App from "../App";
import {render, screen, waitFor} from "@testing-library/react";

test('should show list movies', async function () {
  render(<App/>);

  let movies = [];

  await waitFor(() => {
    movies = screen.getAllByTestId(/movie-item/i);
  }, {timeout: 3000})

  expect(movies.length).toBeGreaterThan(0);
});

