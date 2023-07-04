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
