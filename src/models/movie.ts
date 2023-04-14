import {ISnippet} from "./youtube";

export interface IMovie {
  key?: string;
  snippetId: string;
  sharedBy: string;
  snippet: ISnippet;
  likes: string[];
  dislikes: string[];
}