# Connect-Ed

## Built by
* [Thomas Moran](https://www.linkedin.com/in/thomas-moran-8634007/)
* [Bernardo Vieira](https://www.linkedin.com/in/obernardovieira/)

## Usage
Please install all dependencies before doing anything. Use `npm install` or `yarn`

To run it locally, please remove the *contracts* folder in client/src/ folder, as it is there to be used on the live demo.

With Linux or OSX, just run the `local_demo.sh` script at the project root folder.

Please, make sure to have a local ipfs node instance running.

## Assumptions

### ISP
* ISP will upload valid data, not currepted data, neither fake

### General
* Most imputs have not validation, be sure to write valid data, like in donation window.

## Actors


## How to run the demo

As written above, the easiest way to run the demo is by running the script, but in case you want to run in interely by hand, here's a quick intro.

First of all, install all dependencies, remove the *contracts* folder in client/src/ folder, then go to *ethereum* folder and start a local ganache network by running `npm run start:ganache:dev` and then, without closing it, run `npm run deploy:ganache`.

Now, go to *client* folder, run `npm run link-contracts` to create a folder link in order to be able to use the contracts from the frontend.

Please make sure to have a ipfs node running locally or copy the .env.production to .env.development

Ready to start the frontend, just do it with `npm run start` from the client folder.

In order to use the full app you need at least two different accounts. One of them to be the ISP, which you can use to upload the data file (`demo_data_isp_file.json`) in this project root folder in the /historical page. The second account to be a region admin, so you can withdraw the money donated. Donations are accepted by anyone.

The demo file must be uploaded to a valid region id, for example `1302900`, as well as setting the ISP and region admin.

To set the role to each of those two accounts, you need to use an hidden page /admin. Although the page is public (just not listed), only the user that deployed the contracts can actually set roles.

You are ready, feel free to play around.

In case you do not want to sign up, you can see the system by using either ISP or region admin demo accounts.


## Credits
Thanks to wilawantama for the [favicon](https://www.favicon.cc/?action=icon&file_id=912808)
Thanks to Tahir Khan for the [tree logo](https://pngtree.com/free-vectors)
Thanks to flaticon for the [wifi icon](https://www.flaticon.com/free-icons/wifi)
Thanks to Roundicons for the [avatar](https://www.flaticon.com/authors/roundicons)
