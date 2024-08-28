/*
Form for File Submission
*/
import { useState } from "react";
import styles from "../../styles/Landing.module.css";
import axios from "axios";

const FileForm = () => {
  // Create file state
  const [structureFile, setStructureFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State to store success message

  // Use axios to handle multiple objects including files
  function handleSubmit(event) {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/api/file-input";
    const formData = new FormData();
    formData.append("structureFile", structureFile);

    // Log the formData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    // Send request to API and handle response
    axios
      .post(url, formData, config)
      .then((response) => {
        // Handle success
        if (response.status >= 200 && response.status < 300) {
          const file_path = response.data.structure_path;
          const message = response.data.message;
          setFilePath(file_path); // Set the file path in the state
          setSuccessMessage(response.data.message); // Set the success message in the state
          console.log("The file_path is " + filePath);
        } else {
          // Handle error if status code is not in the range of 2xx
          throw new Error(`HTTP error: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  }

  // Function to handle file download
  const handleDownload = () => {
    axios({
      url: filePath, // Use the filePath from the state
      method: "GET",
      responseType: "blob", // Important
    })
      .then((response) => {
        // Extract the file name from the file path
        const contentDisposition = response.headers["content-disposition"];
        let filename = "downloaded_file"; // Default filename

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch.length === 2) {
            filename = fileNameMatch[1];
          }
        } else {
          // Fallback to extracting filename from filePath if content-disposition header is missing
          const filePathParts = filePath.split("/");
          filename = filePathParts[filePathParts.length - 1];
        }

        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", filename); // Set the download attribute to the original filename
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.error("Error downloading file: ", error);
      });
  };

  return (
    <form className={styles.create} onSubmit={handleSubmit}>
      {/* Input button for structure file */}
      <input
        type="file"
        onChange={(e) => setStructureFile(e.target.files[0])}
        required
      />

      {/* Submit button */}
      <div>
        <input type="submit" value="Submit" />
      </div>

      {/* Display success message if available */}
      {successMessage && (
        <div>
          <p className={styles.successMessage}>{successMessage}</p>
        </div>
      )}

      {/* Download button, shown only when filePath is available */}
      {filePath && (
        <div>
          <button type="button" onClick={handleDownload}>
            Download File
          </button>
        </div>
      )}
    </form>
  );
};

export default FileForm;