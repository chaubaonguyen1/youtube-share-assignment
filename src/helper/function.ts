import {message} from "antd";

export const handleError = async (err: any) => {
  let errorMessage: string;

  if (err?.isHttpRequestError) {
    const json = await (err).response.json();

    errorMessage = typeof json["odata.error"] === "object" ? json["odata.error"].message.value : err.message;

    if ((err).status === 404 && !errorMessage) {
      errorMessage = (err).statusText;
    }

  } else {
    errorMessage = err.message || 'Oops, something has gone wrong...';
  }

  message.error(errorMessage);
}