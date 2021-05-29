import {useEffect} from "react";
import {makeServer} from "../server";

export const useServer = () => {
    useEffect(() => {
        const server = makeServer();

        return () => server.shutdown()
    }, []);
}
