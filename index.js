var parse = require('xml-parser');
var inspect = require('util').inspect;
var fs = require('fs');

const fileOpml = process.argv[2];

let extractedFeeds = [];

fs.readFile(fileOpml, 'utf8', function(err, data) {
  if (err) throw err;
  var obj = parse(data);

  let children = obj.root.children;
  processFolders(getBody(children).children);
  writeOutput(JSON.stringify(extractedFeeds))
})


function getBody(data) {
  for (item of data) {
    if (item.name == "body") {
      return item
    }
  }
}

function processFolders(folders, parentFolder) {
  for (folder of folders) {

    let folderName = folder.attributes.title;
    // process the items, if it's a folder, call this function recursively, if it's a feed, add the folder name and push

    if (folder.attributes.type == "folder") {
      processFolders(folder.children, folderName)
    } else {
      // add folder name to object then push
      let fa = folder.attributes;
      fa.parentFolders = [parentFolder];
      extractedFeeds.push(folder.attributes)
    }
  }
}

function logResults(item) {
  console.log(inspect(item, {
    colors: true,
    depth: Infinity
  }))
}

function writeOutput(data) {
  fs.writeFile('feeds.json', data, (err) => {
    if (err) throw err;
  })
}
