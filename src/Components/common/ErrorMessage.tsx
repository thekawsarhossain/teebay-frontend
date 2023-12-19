import React from "react";
import c from "classnames";
import { ApolloError } from "@apollo/client";

interface ErrorSource {
    message: string;
}

interface GraphQLErrorExtensions {
    errorSources: ErrorSource[];
}

interface ErrorMessageProps {
    error: ApolloError | undefined;
    className?: string;
}

const parseApolloError = (error: ApolloError): string => {
    let errorMessage = "An error occurred.";

    if (error?.graphQLErrors?.length > 0) {
        const extensions = error?.graphQLErrors?.[0]?.extensions as GraphQLErrorExtensions;
        if (extensions?.errorSources?.length > 0) {
            const errorSource = extensions.errorSources[0];
            if (errorSource && typeof errorSource.message === 'string') {
                errorMessage = errorSource.message;
            }
        }
    }
    return errorMessage;
};


const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
    const errorMessage = parseApolloError(error);
    return <p className={c(className, "text-red-600 text-sm")}>{errorMessage}</p>;
};

export default ErrorMessage;
