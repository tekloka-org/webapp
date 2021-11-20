import { Answer } from "./answer";

export class Question {
    
    questionId: string;
    summary: string;
    description: string;
    authorId: string;
    urlPath: string;
    answers: Answer[];
    
}
