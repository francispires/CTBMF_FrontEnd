import {useAuth0} from "@auth0/auth0-react";
import {PageLoader} from "./components/page-loader.js";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/home-page.jsx";
import {Login} from "./login";
import {AuthenticationGuard} from "./components/authentication-guard.jsx";
import {ProfilePage} from "./pages/profile-page.js";
import {PublicPage} from "./pages/public-page.jsx";
import {ProtectedPage} from "./pages/protected-page.jsx";
import {AdminPage} from "./pages/admin-page.jsx";
import {CallbackPage} from "./pages/callback-page.jsx";
import {NotFoundPage} from "./pages/not-found-page.jsx";
import {Accounts} from "./pages/accounts/accounts.tsx";
import {DashBoard} from "./pages/dashboard/dashBoard.tsx";
import {QuestionBank} from "./components/question-bank";
import {UserQuestions} from "./pages/UserQuestions.tsx";
import {EditQuestion} from "./pages/questions/edit-question.tsx";
import ViewQuestion from "./pages/questions/view-question.tsx";
import ViewDiscipline from "./pages/disciplines/view-discipline.tsx";
import EditDiscipline from "./pages/disciplines/edit-discipline.tsx";
import ViewInstitution from "./pages/institutions/view-institution.tsx";
import EditInstitution from "./pages/institutions/edit-institution.tsx";
import UserQuestionBank from "./pages/user-question-bank.tsx";
import QuizzesAttempt from "./pages/quizzes-attempt.tsx";
import {QuizAttemptConfiguration} from "./pages/provas/quiz-attempt-configuration.tsx";
import Provas from "./pages/provas.tsx";
import QuizAttempt from "./pages/quiz-attempt.tsx";
import EditConfig from "./pages/configs/edit-config.tsx";
import ViewConfig from "./pages/configs/view-config.tsx";
import ViewCrew from "./pages/crews/view-crew.tsx";
import EditCrew from "./pages/crews/edit-crew.tsx";
import ViewEnroll from "./pages/enrollments/view-enroll.tsx";
import EditEnroll from "./pages/enrollments/edit-enroll.tsx";
import {Disciplines} from "./pages/disciplines/disciplines.tsx";
import {Configs} from "./pages/configs/configs.tsx";
import {Crews} from "./pages/crews/crews.tsx";
import {Enrollments} from "./pages/enrollments/enrollments.tsx";
import {Institutions} from "./pages/institutions/institutions.tsx";
import {Questions} from "./pages/questions/questions.tsx";
import ViewQuiz from "./pages/provas/view-quiz.tsx";
import EditQuiz from "./pages/provas/edit-quiz.tsx";
import {Reports} from "./pages/dashboard/reports.tsx";
import {Logout} from "./login/Logout";
import ViewUser from "./pages/users/view-user.tsx";
import EditUser from "./pages/users/edit-user.tsx";


const App = () => {
    const {isLoading} = useAuth0();

    if (isLoading) {
        return (
            <div className="page-layout">
                <PageLoader/>
            </div>
        );
    }

    return (
        <Routes>
            {/*Tests*/}
            <Route path="/public" element={<PublicPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>

            {/*Student*/}
            <Route path="/" element={<HomePage/>}/>
            <Route path="/banco-de-questoes" element={<UserQuestionBank/>}/>
            <Route path="/simulados" element={<AuthenticationGuard component={Provas}/>}/>
            <Route path="/simulados/:attemptConfigId" element={<QuizAttempt/>}/>
            <Route path="/quizzes/:attemptConfigId" element={<QuizzesAttempt/>}/>
            <Route path="/questoes" element={<AuthenticationGuard component={UserQuestions}/>}/>
            <Route path="/relatorios" element={<Reports/>}/>
            <Route path="/dashboard" element={<AuthenticationGuard component={DashBoard}/>}/>
            <Route path="/profile" element={<AuthenticationGuard component={ProfilePage}/>}/>

            {/*System*/}
            <Route path="/callback" element={<CallbackPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>

            {/*Teacher*/}

            <Route path="/users" element={<AuthenticationGuard component={Accounts}/>}/>
            <Route path="/view-user/:id" element={<AuthenticationGuard component={ViewUser}/>}/>
            <Route path="/edit-user/:id" element={<AuthenticationGuard component={EditUser}/>}/>

            <Route path="/quizzes" element={<AuthenticationGuard component={QuizAttemptConfiguration}/>}/>
            <Route path="/view-quiz/:id" element={<AuthenticationGuard component={ViewQuiz}/>}/>
            <Route path="/edit-quiz/:id" element={<AuthenticationGuard component={EditQuiz}/>}/>

            <Route path="/disciplines" element={<AuthenticationGuard component={Disciplines}/>}/>
            <Route path="/view-discipline/:id" element={<AuthenticationGuard component={ViewDiscipline}/>}/>
            <Route path="/edit-discipline/:id" element={<AuthenticationGuard component={EditDiscipline}/>}/>

            <Route path="/questions" element={<AuthenticationGuard component={Questions}/>}/>
            <Route path="/view-question/:id" element={<AuthenticationGuard component={ViewQuestion}/>}/>
            <Route path="/edit-question/:id" element={<AuthenticationGuard component={EditQuestion}/>}/>

            <Route path="/institutions" element={<AuthenticationGuard component={Institutions}/>}/>
            <Route path="/view-institution/:id" element={<AuthenticationGuard component={ViewInstitution}/>}/>
            <Route path="/edit-institution/:id" element={<AuthenticationGuard component={EditInstitution}/>}/>

            <Route path="/crews" element={<AuthenticationGuard component={Crews}/>}/>
            <Route path="/view-crew/:id" element={<AuthenticationGuard component={ViewCrew}/>}/>
            <Route path="/edit-crew/:id" element={<AuthenticationGuard component={EditCrew}/>}/>

            <Route path="/question-banks" element={<QuestionBank/>}/>

            {/*Admin*/}
            <Route path="/protected" element={<AuthenticationGuard component={ProtectedPage}/>}/>
            <Route path="/admin" element={<AuthenticationGuard component={AdminPage}/>}/>

            <Route path="/settings" element={<AuthenticationGuard component={Configs}/>}/>
            <Route path="/view-config/:id" element={<AuthenticationGuard component={ViewConfig}/>}/>
            <Route path="/edit-config/:id" element={<AuthenticationGuard component={EditConfig}/>}/>

            <Route path="/enrollments" element={<AuthenticationGuard component={Enrollments}/>}/>
            <Route path="/view-enroll/:id" element={<AuthenticationGuard component={ViewEnroll}/>}/>
            <Route path="/edit-enroll/:id" element={<AuthenticationGuard component={EditEnroll}/>}/>

            <Route path="/usuarios" element={<AuthenticationGuard component={Enrollments}/>}/>
            <Route path="/view-usuarios/:id" element={<AuthenticationGuard component={ViewEnroll}/>}/>
            <Route path="/edit-usuarios/:id" element={<AuthenticationGuard component={EditEnroll}/>}/>

        </Routes>
    );
};

export default App;
