let files = [];

const dropZone =
    document.getElementById("dropZone");

const fileInput =
    document.getElementById("fileInput");

dropZone.addEventListener(
    "dragover",
    e => {
        e.preventDefault();
        dropZone.classList.add("dragging");
    }
);

dropZone.addEventListener(
    "dragleave",
    () => {
        dropZone.classList.remove("dragging");
    }
);

dropZone.addEventListener(
    "drop",
    e => {

        e.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

        uploadFiles(
            [...e.dataTransfer.files]
        );
    }
);

fileInput.addEventListener(
    "change",
    () => {
        uploadFiles(
            [...fileInput.files]
        );
    }
);

async function uploadFiles(
    selectedFiles
) {

    try {

        for (const file of selectedFiles) {

            const filename = file.name;

            const { error } =
                await sb.storage
                .from("files")
                .upload(
                    filename,
                    file
                );

            if (error)
                throw error;
        }

        await loadFiles();

        showToast("uploaded");

    } catch (err) {

        console.error(err);

        showToast(
            "upload failed"
        );
    }
}

async function deleteFile(
    encodedName
) {

    const filename =
        decodeURIComponent(
            encodedName
        );

    try {

        const { error } =
            await sb.storage
                .from("files")
                .remove([
                    filename
                ]);

        if (error)
            throw error;

        await loadFiles();

        showToast("deleted");

    } catch (err) {

        console.error(err);

        showToast(
            "delete failed"
        );
    }
}

async function loadFiles() {

    try {

        const { data, error } =
            await sb.storage
            .from("files")
            .list();

        if (error)
            throw error;

        files = data || [];

        renderFiles();

    } catch (err) {

        console.error(err);
    }
}

function renderFiles() {

    const fileList =
        document.getElementById(
            "fileList"
        );

    if (!files.length) {

        fileList.innerHTML =
            `<div class="empty">
                no files yet
            </div>`;

        return;
    }

    fileList.innerHTML =
        files.map(file => {

            const { data } =
                sb.storage
                .from("files")
                .getPublicUrl(
                    file.name
                );

            return `
                <div class="file-item">

                    <span class="file-name">
                        ${escapeHtml(file.name)}
                    </span>

                    <div class="file-actions">

                        <a
                            class="btn-ghost"
                            href="${data.publicUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            download
                        </a>

                        <button
                            class="btn-ghost"
                            onclick="deleteFile('${encodeURIComponent(file.name)}')"
                        >
                            delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}

loadFiles();