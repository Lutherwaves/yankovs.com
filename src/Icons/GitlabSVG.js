import React from "react"

const GitlabSVG = ({
  style = {},
  fill = "#FFFFFF",
  width = "24",
  height = "24",
  viewBox = "0 0 24 24",
  className = "tanuki-logo",
}) => {
  return (
    <svg
      width={width}
      style={style}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      viewBox={viewBox}
      scale={width / 24}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M1.33334 9.33332 7.58668 15.3333V9.33332L4.92001 1.14666C4.78334.725325 4.13601.725325 4.00001 1.14666L1.33334 9.33332z"
        fill="#e24329"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M22.6667 9.33332 16.4133 15.3333V9.33332L19.08 1.14666C19.2167.725325 19.864.725325 20 1.14666L22.6667 9.33332z"
        fill="#e24329"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M12 22.92 2 9.33334H22L12 22.92z"
        fill="#e24329"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M12 22.92 7.58668 9.33334H1.33334L4.00001 16.6667 12 22.92z"
        fill="#fc6d26"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M12 22.92 16.4133 9.33334H22.6667L20 16.6667 12 22.92z"
        fill="#fc6d26"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M1.33333 9.33334.0666658 13.44C-.0533342 13.8167.0666659 14.24.399999 14.48L12.0133 22.92 1.33333 9.33334z"
        fill="#fca326"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M22.6667 9.33334 23.9333 13.44C24.0533 13.8167 23.9333 14.24 23.6 14.48L12 22.92 22.6667 9.33334z"
        fill="#fca326"
      />
    </svg>
  )
}

export default GitlabSVG
