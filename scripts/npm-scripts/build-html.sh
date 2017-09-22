
CFG_FILE="node_modules/webcube/configs/gulpfile.js"
(
    webcube-start-staticserver
) && (
    gulp --gulpfile $CFG_FILE build:html
)
