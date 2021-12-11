export class ApiConstants {

    public static SIGN_UP_PATH = '/user-service/public/sign-up';  
    public static EMAIL_VERIFICATION = '/user-service/public/email-verification/{emailAddress}/{verificationKey}';    
    public static LOGIN_PATH = '/user-service/public/login';

    public static UPLOAD_CONTENT_IMAGE = '/file-server/file/upload-content-image';

    public static GET_ALL_CATEGORIES = '/category-service/public/get-all-categories';
    public static SAVE_CATEGORY = '/category-service/category/save';
    public static UPDATE_CATEGORY = '/category-service/category/update';
    public static DELETE_CATEGORY = '/category-service/category/delete';
    public static GET_CATEGORY_PAGE_LINKS = '/category-service/public/{categoryPath}/get-category-page-links';
    public static UPDATE_PAGE_LINKS = '/category-service/page/update-page-links';
    public static GET_CATEGORY_PAGE = '/category-service/public/get-category-page/{categoryUrlPath}/{pageUrlPath}';

    public static SAVE_PERMISSION = '/user-service/permission/save';
    public static UPDATE_PERMISSION = '/user-service/permission/update';
    public static DELETE_PERMISSION = '/user-service/permission/delete';
    public static GET_ALL_PERMISSIONS = '/user-service/permission/get-all-permissions';

    public static SAVE_ROLE = '/user-service/role/save';
    public static UPDATE_ROLE = '/user-service/role/update';
    public static DELETE_ROLE = '/user-service/role/delete';
    public static GET_ALL_ROLES = '/user-service/role/get-all-roles';
    public static GET_ROLE = '/user-service/role/get-role/{roleCode}';

    public static SAVE_USER = '/user-service/user/save';
    public static UPDATE_USER = '/user-service/user/update';
    public static DELETE_USER = '/user-service/user/delete';
    public static GET_ALL_USERS = '/user-service/user/get-all-users';
    public static GET_USER = '/user-service/user/get-user/{userId}';
    public static GET_LOGGED_IN_USER = '/user-service/user/get-logged-in-user';

    public static SAVE_PAGE = '/category-service/page/save';
    public static UPDATE_PAGE = '/category-service/page/update';
    public static DELETE_PAGE = '/category-service/page/delete';

    public static SAVE_ARTICLE = '/article-service/article/save';
    public static UPDATE_ARTICLE = '/article-service/article/update';
    public static DELETE_ARTICLE = '/article-service/article/delete';
    public static GET_ALL_ARTICLES = '/article-service/public/get-all-articles';
    public static GET_ARTICLE = '/article-service/public/{authorId}/{urlPath}';

    public static SAVE_QUESTION = '/discussion-service/question/save';
    public static UPDATE_QUESTION = '/discussion-service/question/update';
    public static DELETE_QUESTION = '/discussion-service/question/delete';
    public static GET_ALL_QUESTIONS = '/discussion-service/public/get-all-questions';
    public static GET_QUESTION = '/discussion-service/public/get-question/{authorId}/{urlPath}';

    public static SAVE_ANSWER = '/discussion-service/question/save-answer';
    public static UPDATE_ANSWER = '/discussion-service/question/update-answer';
    public static DELETE_ANSWER = '/discussion-service/question/delete-answer';
    public static GET_ALL_ANSWERS = '/discussion-service/public/get-all-answers/{authorId}/{urlPath}';

}