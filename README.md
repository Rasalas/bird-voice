# Bird Voice

Static Web-Audio prototype for lowering high nature sounds in the browser.

## Run

The microphone API needs a secure context on phones, so this project uses a local HTTPS server with a self-signed certificate.

```sh
npm start
```

Open the printed `https://<local-ip>:4443` address on a phone in the same network and accept the local certificate warning.

## GitHub Pages

The app is fully static. Publish the repository with GitHub Pages from the `main` branch and `/` root.
