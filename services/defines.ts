export enum Keys {
  sessionId = "sessionId",
}

export enum Err {
  main_cafe_has_no_cafe_category_record = "error_main_cafe_has_no_cafe_category_record",
  cafe_not_exists = "error_cafe_not_exists",
  wrong_session_id = "error_wrong_session_id",
  user_not_found_by_that_session_id = "error_user_not_found_by_that_session_id",
  cannot_connect_to_server = "cannot_connect_to_server",
  category_not_exists = "error_category_not_exists",
  user_has_no_firebase_uid = "error_user_has_no_firebase_uid",
  entity_not_found = "error_entity_not_found",
  login_first = "error_login_first",
}

export const DEFAULT_TOPIC = "defaultTopic";
