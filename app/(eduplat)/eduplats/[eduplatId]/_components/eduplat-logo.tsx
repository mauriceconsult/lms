const EduPlatLogo = () => {
  return (
    <svg
      width="200"
      height="50"
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="50" rx="10" fill="url(#paint0_linear)" />
      <text
        x="20"
        y="32"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="#FFFFFF"
      >
        EduPlat
      </text>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="0"
          y1="0"
          x2="200"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4A90E2" />
          <stop offset="1" stopColor="#0070F3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default EduPlatLogo;
