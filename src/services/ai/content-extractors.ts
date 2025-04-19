
import { ContentExtractor } from "./types";

export const extractWorkflowType: ContentExtractor = (content: string) => {
  const words = content.split(' ');
  const index = words.indexOf('workflow');
  return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
};

export const extractHelpTopic: ContentExtractor = (content: string) => {
  const words = content.split(' ');
  const index = words.indexOf('hjelp');
  return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
};

export const extractCommand: ContentExtractor = (content: string) => {
  const words = content.split(' ');
  const index = words.indexOf('kommando');
  return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
};
