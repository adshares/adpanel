package pl.adshares.adpanel.tools;

import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

public class Xml {
  private static NodeList getNodes(String path, String node) {
    NodeList nodeList = null;
    try {
      File file = new File(path);
      DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
      DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
      Document document;
      document = documentBuilder.parse(file);
      nodeList = document.getElementsByTagName(node);
    } catch (SAXException | IOException | ParserConfigurationException e) {
      e.printStackTrace();
    }
    return nodeList;
  }

  public static String getValue(String path, String node, String name) {
    String value = "blad odczytu wartosci z pliku xml";
    NodeList nodeList = getNodes(path, node);

    for (int i = 0; i < nodeList.getLength(); i++) {
      Node myNode = nodeList.item(i);
      Element element = (Element) myNode;
      if (element.getAttribute("name").equals(name)) {
        value = element.getAttribute("value");
        break;
      }
    }

    return value;
  }

  public void createXml(File file, Map<String, String> properties) {
    try {
      org.jdom2.Element prop = new org.jdom2.Element("properties");

      for (Map.Entry<String, String> property : properties.entrySet()) {
        org.jdom2.Element parameter = new org.jdom2.Element("property");
        parameter.setAttribute("name", property.getKey());
        parameter.setAttribute("value", property.getValue());
        prop.addContent(parameter);
      }

      org.jdom2.Document document = new org.jdom2.Document(prop);

      XMLOutputter xmlOutputter = new XMLOutputter();
      xmlOutputter.setFormat(Format.getPrettyFormat());
      xmlOutputter.output(document, new FileWriter(file));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
