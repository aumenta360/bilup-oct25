"use client"

import { CreateProgramProvider } from '../../../context/create-program-context';
import CreateStampProgramContent from './CreateStampProgramContent';

const CreateStampProgramV2 = () => {
  return (
    <CreateProgramProvider>
      <CreateStampProgramContent />
    </CreateProgramProvider>
  );
};

export default CreateStampProgramV2; 