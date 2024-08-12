import React, { useState, useEffect } from "react";
import FootballField from "../../components/FootballField";
import InstructionsModal from "../../components/InstructionsModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <InstructionsModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <FootballField />
    </main>
  );
}

export default Home;
