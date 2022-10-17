import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        height="90vh"
        p="10px"
        overflowY={"hidden"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
