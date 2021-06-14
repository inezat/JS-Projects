import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

/**
 * Servlet implementation class UserRegistrationServlet
 */
@WebServlet("/UserRegistrationServlet")
@MultipartConfig
public class UserRegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UserRegistrationServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		final PrintWriter out = response.getWriter();

		String name = request.getParameter("name");
		String email = request.getParameter("email");
		String location = request.getParameter("location");
		String gender = request.getParameter("gender");
		String experience = request.getParameter("experience");
		String fileName = request.getParameter("fileName");

		/*
		 * request.getPart is to get the uploaded file handler. You can use
		 * filePart.getInputStream() to read the streaming data from client, for
		 * example: InputStream filecontent = filePart.getInputStream();
		 */
		Part filePart = request.getPart("file");
		InputStream filecontent = filePart.getInputStream();

		/*
		 * fileout is for you to save the uploaded picture in your local disk.
		 */

		OutputStream fileout = null;
		/*
		 * check whether the client's inputs are complete or not; 
		 * if anything is missing, return a web page that
		 * contains a link to go back to the registration page (e.g.,
		 * UserRegistration.html)
		 */

		if (name == null || 
			email == null || 
			location == null || 
			gender == null || 
			experience == null || 
			fileName == null) {
			String docType = "<!doctype html public \"-//w3c//dtd html 4.0 transitional//en\">\n";
			out.println(docType
					+ "<html>\n"
					+ "<head><title>User registration</title></head>\n"
					+ "<body>\n"
					+ "<h1>Your input information is not complete, try again "
					+ "<a href=\"http://18.191.253.176:8080/UserRegistrationProject/UserRegistration.html\">go back </a>"
					+ "</h1>"
					+ "</body></html>");
		}

		/*
		 * save the uploaded picture under your project WebContent directory
		 * send back the client's registration information to the client
		 */

		else {
			String picPath = "C:/Users/Administrator/eclipse-workspace/UserRegistrationProject/src/main/webapp/savefile.jpg";
			fileout = new FileOutputStream(picPath);
			byte[] buffer = new byte[1000];
			int c = 0;
			while ((c = filecontent.read(buffer, 0, buffer.length)) > 0) {
				fileout.write(buffer, 0, c);
				fileout.flush();
			}
			String docType = "<!doctype html public \"-//w3c//dtd html 4.0 transitional//en\">\n";
			out.println("<html>\n"
					+ "<head><title>User registration</title></head>\n"
					+ "<body>\n" + "<h1 align=\"center\"> Welcome " + name + "</h1>"
					+ "<ul>\n"
					+ " <li><b>Your name</b>: " + name
					+ "\n"
					+ " <li><b>Your email</b>: " + email
					+ "\n"
					+ " <li><b>Your location</b>: "	+ location
					+ "\n"
					+ " <li><b>Your gender</b>: " + gender
					+ "\n"
					+ " <li><b>Your experience</b>: " + experience
					+ "\n"
					+ "<li><b>Your profile picture " + fileName + " has been uploaded successful:" + "<br />"
					+ "\n"
					+ "<img src='./savefile.jpg'>"
					+ "\n"
					+ "</ul>\n" 
			        + "</body></html>");
			fileout.close();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}