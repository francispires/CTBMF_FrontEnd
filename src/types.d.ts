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
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

type PagedResponse<T> = {
    type: string;
    data: T[];
    pagination: Pagination;
}
interface PaginatedRequest<T>{
    perPage: number,
    page: number,
    sort: string,
    filter: T
}

type GetUsersResponse = {
    data: AuthUser[];
};
interface UsersRequest {
    text: string
}