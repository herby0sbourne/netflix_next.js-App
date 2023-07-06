async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });

  return await result.json();
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await fetchGraphQL(operationsDoc, "isNewUser", { issuer }, token);

  return response?.data?.users?.length === 0;
}

export const createUser = async (token, metadata) => {
  const operationsDoc = `
  mutation createUser($email:String!, $issuer:String!, $publicAddress:String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
`;

  const response = await fetchGraphQL(
    operationsDoc,
    "createUser",
    {
      email: metadata.email,
      issuer: metadata.issuer,
      publicAddress: metadata.publicAddress
    },
    token
  );

  return response;
};

export const findVideoIdByUserId = async (token, userId, videoId) => {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, 
    videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  const response = await fetchGraphQL(
    operationsDoc,
    "findVideoIdByUserId",
    { videoId, userId },
    token
  );

  return response?.data?.stats;
};

export const updateStats = async (token, data) => {
  const { userId, watched, videoId, favourited } = data;

  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
    update_stats(
      _set: {favourited: $favourited, watched: $watched},
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
        returning {
          favourited
          id
          userId
          videoId
          watched
        }
    }
  }
`;
  return await fetchGraphQL(
    operationsDoc,
    "updateStats",
    { userId, watched, videoId, favourited },
    token
  );
};

export const insertStats = async (token, data) => {
  const { userId, watched, videoId, favourited } = data;

  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
    insert_stats_one(object: {
      favourited: $favourited,  
      userId: $userId, 
      videoId: $videoId, 
      watched: $watched
    }) {
      favourited
      userId
    }
  
  }
`;

  return await fetchGraphQL(
    operationsDoc,
    "insertStats",
    { userId, watched, videoId, favourited },
    token
  );
};

export const getWatchedVideosList = async (token, userId) => {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: { 
        watched: {_eq: true}, 
        userId: {_eq: $userId}, 
    }) {
      videoId
    }
  }
`;

  const response = await fetchGraphQL(operationsDoc, "watchedVideos", { userId }, token);

  return response?.data?.stats;
};

export const myLikeVideos = async (token, userId) => {
  const operationsDoc = `
  query myLikeVideos($userId: String!) {
    stats(where: {favourited: {_eq: 1}, userId: {_eq: $userId}}) {
      videoId
    }
  }
`;

  const response = await fetchGraphQL(operationsDoc, "myLikeVideos", { userId }, token);

  return response?.data?.stats;
};
