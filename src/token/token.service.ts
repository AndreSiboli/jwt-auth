import refreshTokenModel from "./token.model";
import config from "../token/token.config";

interface DatasType {
  user_id: string;
  refresh_token: string;
}

interface UpdateType {
  user_id: string;
  refresh_token: string;
  old_refresh_token: string;
}

export async function getRefreshTokenDB(data: DatasType) {
  return await refreshTokenModel.findOne({
    user_id: data.user_id,
    refresh_token: data.refresh_token,
  });
}

export async function saveRefreshTokenDB(data: DatasType) {
  const expiresInMill = config.expiresInRefreshToken * 1000;

  return await new refreshTokenModel({
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    expiresIn: Date.now() + expiresInMill,
    updatedIn: Date.now(),
  }).save();
}

export async function updateRefreshTokenDB(data: UpdateType) {
  const expiresInMill = config.expiresInRefreshToken * 1000;

  return await refreshTokenModel.findOneAndUpdate(
    { user_id: data.user_id, refresh_token: data.old_refresh_token },
    {
      refresh_token: data.refresh_token,
      expiresIn: Date.now() + expiresInMill,
      updatedIn: Date.now(),
    }
  );
}

export async function deleteRefreshTokenDB(data: DatasType) {
  return await refreshTokenModel.findOneAndDelete({
    user_id: data.user_id,
    refresh_token: data.refresh_token,
  });
}

export async function manageTokenExpirationDB() {
  return await refreshTokenModel.deleteMany().where("expiresIn").lt(Date.now());
}
