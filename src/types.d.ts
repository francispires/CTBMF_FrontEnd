interface CounterState {
    value: number
}
interface LoginModel {
    username: string,
    password: string
}

interface Column {
    name: string,
    uid: string,
    sortable?: boolean,
    filterable?: boolean,
}

type Discipline = {
    picture: string;
    id: string,
    name: string,
    description: string,
    image: string,
    parentId: string | null,
    parentName: string | null,
    parent:Discipline | null,
    childs: Discipline[]| null,
    childsCount: number| null,
    questions: Question[] | null
}

interface Institution {
    id: string,
    name: string,
    state: string,
    stadual: boolean,
    private: boolean,
    questions: Question[] | null
    questionBanks: QuestionBank[] | null
}

type Questiona = {
    id: string,
    year: number,
    Board: string,
    Image: string,
    Text: string,
    Score: number,
    institutionId: string,
    institution: Institution,
    institutionName: string,
    questionBankId: string,
    questionBank: QuestionBank,
    questionBankName: string,
    quizAttemptId: string,
    quizAttempt: QuizAttempt,
    alternatives: Alternative[] | null,
    observations: Observation[] | null,
    answers: Answer[] | null,
    observationRequests: ObservationRequest[] | null,
    disciplines: Discipline[] | null
}


type AuthUser = {
    status: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    createdAt:string
    lastIpAddress:string
    lastLogin:string
    lastPasswordReset:string
    locale:string
    loginsCount:string
    updatedAt:string
    userId:string
    providerAttributes:string
    multifactor:string
    appMetadata:string
    email:string
    emailVerified:boolean
    phoneNumber:string
    phoneVerified:boolean
    userMetadata:string
    userName:string
    nickName:string
    firstName:string
    fullName:string
    lastName:string
    picture:string
    crew:string
    blocked:boolean | null
};

type Pagination = {
    currentPage: number;
    pageSize: number;
    rowCount: number;
    pageCount: number;
};

type PagedResponse<T> = {
    type: string;
    queryable: T[];
    currentPage: number;
    pageSize: number;
    rowCount: number;
    pageCount: number;
    hasMore: boolean;
}
interface PagedRequest{
    pageSize: number,
    currentPage: number,
    sort: string,
    filter: string
}

type GetUsersResponse = {
    data: AuthUser[];
};
interface UsersRequest {
    text: string
}